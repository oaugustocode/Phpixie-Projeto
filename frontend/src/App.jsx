import { useState } from 'react'
import { api, setSession, useHashPath, useSession } from './api.js'
import { Tecnologia, Trilha } from './Catalogo.jsx'
import { ComoComecar } from './ComoComecar.jsx'
import { GuiaCurriculo } from './Curriculos.jsx'
import { DiarioEstudos, DiarioForm } from './Diario.jsx'
import { ExploradorDocs } from './Docs.jsx'
import { Home } from './Home.jsx'
import { Icone } from './Icone.jsx'
import { Perfil } from './Perfil.jsx'
import { QuemSomos } from './QuemSomos.jsx'

function NaoEncontrada() {
  return (
    <article className="pagina">
      <h1 className="titulo-medio">Página não encontrada</h1>
      <p className="lead">Esse endereço não existe. Use o menu ou volte para o início.</p>
      <a className="btn" href="#/">
        Ir para o início
      </a>
    </article>
  )
}

function route(path) {
  const [, a, b] = path.split('/')
  if (a === '') return <Home />
  if (a === 'tecnologias' && b) return <Tecnologia id={b} key={b} />
  if (a === 'como-comecar') return <ComoComecar />
  if (a === 'trilhas' && b) return <Trilha id={b} key={b} />
  if (a === 'como-criar-curriculo') return <GuiaCurriculo />
  if (a === 'diario' && !b) return <DiarioEstudos />
  if (a === 'diario') return <DiarioForm id={b === 'novo' ? null : b} key={b} />
  if (a === 'perfil') return <Perfil />
  if (a === 'quem-somos') return <QuemSomos />
  return <NaoEncontrada />
}

export default function App() {
  const session = useSession()
  const path = useHashPath()

  if (!session) return <Login />
  if (path === '/docs' || path.startsWith('/docs/')) return <ExploradorDocs path={path} />

  return (
    <div className="shell">
      <a className="pular" href="#conteudo" onClick={(e) => (e.preventDefault(), document.getElementById('conteudo').focus())}>
        Pular para o conteúdo
      </a>

      <Sidebar usuario={session.usuario} path={path} />

      <main id="conteudo" tabIndex={-1}>
        {route(path)}
      </main>
    </div>
  )
}

const UTILIDADES = [
  ['Como começar', 'manual', '#/como-comecar'],
  ['Como criar um currículo dev', 'curriculo', '#/como-criar-curriculo'],
  ['Diário de estudos', 'codigo', '#/diario'],
  ['Quem somos', 'equipe', '#/quem-somos'],
]

function Sidebar({ usuario, path }) {
  const [saindo, setSaindo] = useState(false)
  const [aberto, setAberto] = useState(false) // só vale no celular, onde o menu começa recolhido
  const iniciais = usuario.nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()

  async function sair() {
    setSaindo(true)
    // Mesmo se a API falhar, a sessão local é encerrada
    await api('/auth/logout', { method: 'POST' }).catch(() => {})
    setSession(null)
    window.location.hash = '/'
  }

  const item = (rotulo, icone, href) => (
    <a href={href} className="lado-item" aria-current={path === href.slice(1) ? 'page' : undefined}>
      <Icone nome={icone} />
      {rotulo}
    </a>
  )

  return (
    <aside
      className="lombada lombada-recolhivel"
      data-aberto={aberto || undefined}
      onClick={(e) => e.target.closest('a') && setAberto(false)}
    >
      <div className="lado-topo">
        <a className="lado-marca" href="#/">
          <span className="lado-logo" aria-hidden="true">
            {'</>'}
          </span>
          Central de Programadores
        </a>
        <button
          className="lado-menu"
          onClick={() => setAberto(!aberto)}
          aria-expanded={aberto}
          aria-controls="menu-lateral"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        >
          <Icone nome={aberto ? 'fechar' : 'menu'} />
        </button>
      </div>

      <nav id="menu-lateral" aria-label="Menu lateral">
        <ul>
          <li>{item('Bem-vindo', 'manual', '#/')}</li>
        </ul>

        <p className="lado-secao">Documentações</p>
        <a className="btn lado-explorar" href="#/docs">
          <Icone nome="manual" />
          Explorar Documentações
        </a>

        <hr />

        <p className="lado-secao">Utilidades dev</p>
        <ul>
          {UTILIDADES.map(([rotulo, icone, href]) => (
            <li key={rotulo}>{item(rotulo, icone, href)}</li>
          ))}
        </ul>
      </nav>

      <div className="lado-perfil">
        <span className="lado-avatar" aria-hidden="true">
          {iniciais}
        </span>
        <a className="lado-conta" href="#/perfil">
          <strong>{usuario.nome}</strong>
          <span>{usuario.email}</span>
        </a>
        <button className="lado-sair" onClick={sair} disabled={saindo} aria-label="Sair da conta" title="Sair da conta">
          <Icone nome="sair" />
        </button>
      </div>
    </aside>
  )
}

function Login() {
  const [modo, setModo] = useState('entrar')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [verSenha, setVerSenha] = useState(false)
  const cadastro = modo === 'cadastro'
  const trocar = (m) => (setModo(m), setErro(null))

  async function enviar(e) {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      const body = Object.fromEntries(new FormData(e.currentTarget))
      setSession(await api(cadastro ? '/auth/cadastro' : '/auth/login', { method: 'POST', body }))
    } catch (err) {
      setErro(err.message)
      setEnviando(false)
    }
  }

  return (
    <div className="login">
      <div className="login-card">
        <form className="login-form" onSubmit={enviar}>
          <p className="login-marca">
            <span className="lado-logo" aria-hidden="true">
              {'</>'}
            </span>
            Central de Programadores
          </p>

          <div className="login-abas" role="group" aria-label="Entrar ou criar conta">
            <button type="button" aria-pressed={!cadastro} onClick={() => trocar('entrar')}>
              <Icone nome="entrar" />
              Entrar
            </button>
            <button type="button" aria-pressed={cadastro} onClick={() => trocar('cadastro')}>
              <Icone nome="criarConta" />
              Criar conta
            </button>
          </div>
          <h1 className="sr-only">{cadastro ? 'Criar conta' : 'Entrar'}</h1>

          {cadastro && (
            <label>
              Nome
              <input name="nome" autoComplete="name" placeholder="Seu nome" required />
            </label>
          )}
          <label>
            E-mail
            <input name="email" type="email" autoComplete="email" placeholder="seu@email.com" required />
          </label>
          <div className="login-campo">
            <label htmlFor="login-senha">Senha</label>
            <span className="login-senha">
              <input
                id="login-senha"
                name="senha"
                type={verSenha ? 'text' : 'password'}
                autoComplete={cadastro ? 'new-password' : 'current-password'}
                placeholder={cadastro ? 'Mínimo de 6 caracteres' : 'Sua senha'}
                minLength={cadastro ? 6 : undefined}
                required
              />
              <button
                type="button"
                aria-label={verSenha ? 'Esconder senha' : 'Mostrar senha'}
                aria-pressed={verSenha}
                onClick={() => setVerSenha(!verSenha)}
              >
                <Icone nome={verSenha ? 'olhoFechado' : 'olho'} />
              </button>
            </span>
          </div>

          {erro && (
            <p className="erro" role="alert">
              {erro}
            </p>
          )}
          <button className="btn login-enviar" disabled={enviando}>
            {enviando ? 'Aguarde…' : cadastro ? 'Criar conta' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
