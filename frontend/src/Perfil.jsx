import { useState } from 'react'
import { api, setSession, useApi, useSession } from './api.js'
import { Estado } from './Estado.jsx'

export function Perfil() {
  const session = useSession()
  const { data, ...estado } = useApi('/perfil')
  const [aviso, setAviso] = useState(null)
  const [salvando, setSalvando] = useState(false)
  if (!data) return <Estado {...estado} />

  async function salvar(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      const perfil = await api('/perfil', { method: 'PUT', body: Object.fromEntries(new FormData(e.currentTarget)) })
      setSession({ ...session, usuario: { ...session.usuario, nome: perfil.nome } })
      setAviso({ ok: true, texto: 'Perfil salvo.' })
    } catch (err) {
      setAviso({ ok: false, texto: err.message })
    }
    setSalvando(false)
  }

  return (
    <article className="pagina">
      <h1 className="titulo-medio">Seu perfil</h1>
      <form className="form" onSubmit={salvar}>
        <label>
          Nome
          <input name="nome" defaultValue={data.nome} required />
        </label>
        <label>
          E-mail
          <input value={data.email} readOnly />
        </label>
        <label>
          Área de atuação
          <input name="area_atuacao" defaultValue={data.area_atuacao || ''} placeholder="Ex.: desenvolvimento web" />
        </label>
        <label>
          Sobre você
          <textarea name="bio" rows={4} defaultValue={data.bio || ''} />
        </label>
        <label>
          GitHub
          <input name="github" type="url" defaultValue={data.github || ''} placeholder="https://github.com/seu-usuario" />
        </label>
        <label>
          LinkedIn
          <input name="linkedin" type="url" defaultValue={data.linkedin || ''} placeholder="https://linkedin.com/in/seu-usuario" />
        </label>
        {aviso && (
          <p className={aviso.ok ? 'sucesso' : 'erro'} role="status">
            {aviso.texto}
          </p>
        )}
        <div className="acoes">
          <button className="btn" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar perfil'}
          </button>
        </div>
      </form>
    </article>
  )
}
