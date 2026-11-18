import { NIVEL_TRILHA, useApi } from './api.js'
import { Estado } from './Estado.jsx'

export function Tecnologia({ id }) {
  const tec = useApi(`/tecnologias/${id}`)
  const trilhas = useApi(`/tecnologias/${id}/trilhas`)
  if (!tec.data) return <Estado {...tec} />

  const t = tec.data
  const categoria = t.categoria[0].toUpperCase() + t.categoria.slice(1)

  return (
    <article className="pagina">
      <p className="categoria">{categoria}</p>
      <h1 className="titulo-grande">{t.nome}</h1>
      <p className="lead">{t.resumo}</p>
      {t.url_documentacao ? (
        <a className="btn" href={t.url_documentacao} target="_blank" rel="noreferrer">
          Abrir documentação oficial
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      ) : (
        <p className="nota">Este é um conceito, então não tem uma documentação oficial. Use as trilhas abaixo.</p>
      )}

      <section className="bloco">
        <h2>Como começar com {t.nome}</h2>
        <Estado {...trilhas} />
        {trilhas.data?.length === 0 && <p className="nota">Ainda não há trilhas para esta tecnologia.</p>}
        <ul className="linhas">
          {trilhas.data?.map((tr) => (
            <li key={tr.id}>
              <a className="linha" href={`#/trilhas/${tr.id}`}>
                <span className="linha-titulo">{tr.titulo}</span>
                <span className="linha-meta">{NIVEL_TRILHA[tr.nivel].toLowerCase()}</span>
                {tr.descricao && <span className="linha-texto">{tr.descricao}</span>}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}

export function Trilha({ id }) {
  const { data: tr, ...estado } = useApi(`/trilhas/${id}`)
  if (!tr) return <Estado {...estado} />

  return (
    <article className="pagina">
      <a className="voltar" href={`#/tecnologias/${tr.tecnologia_id}`}>
        {tr.tecnologia_nome}
      </a>
      <h1 className="titulo-medio">{tr.titulo}</h1>
      <p className="categoria">Nível {NIVEL_TRILHA[tr.nivel].toLowerCase()}</p>
      <p className="lead">{tr.descricao}</p>

      <section className="bloco">
        <h2>Vídeos recomendados</h2>
        {tr.videos.length === 0 ? (
          <p className="nota">
            Esta trilha ainda não tem vídeos. Enquanto isso, use a{' '}
            <a href={`#/tecnologias/${tr.tecnologia_id}`}>documentação de {tr.tecnologia_nome}</a>.
          </p>
        ) : (
          <ol className="videos">
            {tr.videos.map((v) => (
              <li key={v.id}>
                <h3>{v.titulo}</h3>
                {v.canal && <p className="linha-meta">{v.canal}</p>}
                {v.descricao && <p>{v.descricao}</p>}
                <a href={v.url} target="_blank" rel="noreferrer">
                  Assistir no YouTube<span className="sr-only"> (abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ol>
        )}
      </section>
    </article>
  )
}
