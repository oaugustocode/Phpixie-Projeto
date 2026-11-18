import { useState } from 'react'
import { api, go, STATUS_ESTUDO, useApi } from './api.js'
import { Estado } from './Estado.jsx'

const dataBR = (sqlDate) => new Date(sqlDate.replace(' ', 'T') + 'Z').toLocaleDateString('pt-BR')

const Status = ({ valor }) => <span className={`status status-${valor}`}>{STATUS_ESTUDO[valor]}</span>

export function DiarioEstudos() {
  const { data, reload, ...estado } = useApi('/anotacoes')
  const [erro, setErro] = useState(null)

  async function apagar(a) {
    if (!window.confirm(`Apagar a anotação "${a.titulo}"? Isso não pode ser desfeito.`)) return
    try {
      await api(`/anotacoes/${a.id}`, { method: 'DELETE' })
      reload()
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <article className="pagina">
      <div className="cabecalho">
        <h1 className="titulo-grande">Diário de estudos</h1>
        <a className="btn" href="#/diario/novo">
          Nova anotação
        </a>
      </div>
      {erro && (
        <p className="erro" role="alert">
          {erro}
        </p>
      )}
      <Estado {...estado} reload={reload} />
      {data?.length === 0 && (
        <p className="lead">Você ainda não tem anotações. Registre o que estudou hoje, com um trecho de código se quiser.</p>
      )}
      <ul className="linhas">
        {data?.map((a) => (
          <li key={a.id} className="linha linha-acoes">
            <a href={`#/diario/${a.id}`}>
              <span className="linha-titulo">
                {a.titulo} <Status valor={a.status} />
              </span>
              <span className="linha-meta">
                {a.tecnologias.length > 0 && `${a.tecnologias.map((t) => t.nome).join(', ')} · `}
                atualizado em {dataBR(a.atualizado_em)}
              </span>
            </a>
            <button className="link perigo" onClick={() => apagar(a)}>
              Apagar<span className="sr-only"> {a.titulo}</span>
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}

const VAZIO = { titulo: '', status: 'estudando', resumo: '', codigo: '', tecnologias: [] }

export function DiarioForm({ id }) {
  const atual = useApi(id && `/anotacoes/${id}`)
  const catalogo = useApi('/tecnologias')
  const [form, setForm] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [salvando, setSalvando] = useState(false)

  if (id && !atual.data) return <Estado {...atual} />
  const nota = form || (id ? atual.data : VAZIO)

  const set = (campo) => (e) => setForm({ ...nota, [campo]: e.target.value })
  const marcada = (tec) => nota.tecnologias.some((t) => String(t.id) === String(tec.id))

  function marcar(tec, ligar) {
    const resto = nota.tecnologias.filter((t) => String(t.id) !== String(tec.id))
    setForm({ ...nota, tecnologias: ligar ? [...resto, { id: tec.id, nome: tec.nome }] : resto })
  }

  async function salvar(e) {
    e.preventDefault()
    setSalvando(true)
    setAviso(null)
    try {
      const salvo = await api(id ? `/anotacoes/${id}` : '/anotacoes', { method: id ? 'PUT' : 'POST', body: nota })
      setForm(salvo)
      setAviso({ ok: true, texto: 'Anotação salva.' })
      if (!id) go(`/diario/${salvo.id}`)
    } catch (err) {
      setAviso({ ok: false, texto: err.message })
    }
    setSalvando(false)
  }

  return (
    <article className="pagina pagina-larga">
      <a className="voltar" href="#/diario">
        Diário de estudos
      </a>
      <h1 className="titulo-medio">{id ? 'Editar anotação' : 'Nova anotação'}</h1>

      <div className="editor">
        <form className="form" onSubmit={salvar}>
          <label>
            Título
            <input value={nota.titulo} onChange={set('titulo')} placeholder="Ex.: Closures em JavaScript" required />
          </label>
          <label>
            Status
            <select value={nota.status} onChange={set('status')}>
              {Object.entries(STATUS_ESTUDO).map(([v, r]) => (
                <option key={v} value={v}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label>
            Anotação / resumo
            <textarea rows={5} value={nota.resumo || ''} onChange={set('resumo')} placeholder="O que você entendeu, com suas palavras" required />
          </label>
          <label>
            Snippet de código (opcional)
            <textarea className="campo-codigo" rows={8} value={nota.codigo || ''} onChange={set('codigo')} spellCheck={false} />
          </label>

          <fieldset>
            <legend>Tecnologias relacionadas</legend>
            <Estado {...catalogo} />
            {catalogo.data?.map((tec) => (
              <div className="tec" key={tec.id}>
                <label className="check">
                  <input type="checkbox" checked={marcada(tec)} onChange={(e) => marcar(tec, e.target.checked)} />
                  {tec.nome}
                </label>
              </div>
            ))}
          </fieldset>

          {aviso && (
            <p className={aviso.ok ? 'sucesso' : 'erro'} role="status">
              {aviso.texto}
            </p>
          )}
          <div className="acoes">
            <button className="btn" disabled={salvando}>
              {salvando ? 'Salvando…' : 'Salvar anotação'}
            </button>
          </div>
        </form>

        <Previa nota={nota} />
      </div>
    </article>
  )
}

function Previa({ nota }) {
  return (
    <section className="previa" aria-label="Pré-visualização da anotação">
      <Status valor={nota.status} />
      <h2 className="previa-nome">{nota.titulo || 'Título da anotação'}</h2>
      {nota.tecnologias.length > 0 && (
        <ul className="previa-tecs">
          {nota.tecnologias.map((t) => (
            <li key={t.id}>{t.nome}</li>
          ))}
        </ul>
      )}
      {nota.resumo && (
        <>
          <h3>Anotação</h3>
          <p className="quebras">{nota.resumo}</p>
        </>
      )}
      {nota.codigo && (
        <>
          <h3>Código</h3>
          <pre className="previa-codigo">
            <code>{nota.codigo}</code>
          </pre>
        </>
      )}
    </section>
  )
}
