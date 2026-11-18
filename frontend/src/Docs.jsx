import { useEffect, useMemo, useRef, useState } from 'react'
import { Icone } from './Icone.jsx'

// Tecnologias do curso, em destaque no topo do catálogo
const PRINCIPAIS = ['php', 'javascript', 'html', 'css', 'http', 'python~3.13', 'postgresql~17', 'sqlite', 'react', 'git', 'openjdk~21']
const MAX_RESULTADOS = 100

// ---------- Rede (cache por URL; o index.json do JavaScript passa de 100 KB) ----------

const cache = new Map()
function buscar(url, tipo) {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url)
        .then((r) => {
          if (!r.ok) throw new Error(`O DevDocs respondeu com erro ${r.status}.`)
          return r[tipo]()
        })
        .catch((e) => {
          cache.delete(url)
          throw e instanceof TypeError ? new Error('Sem conexão com o DevDocs.') : e
        }),
    )
  }
  return cache.get(url)
}

/** Devolve { carregando } | { erro } | { data }; `url` null = não busca. */
function useBusca(url, tipo = 'json') {
  const [s, setS] = useState({ url: null })
  useEffect(() => {
    if (!url) return
    let vivo = true
    buscar(url, tipo).then(
      (data) => vivo && setS({ url, data }),
      (erro) => vivo && setS({ url, erro }),
    )
    return () => {
      vivo = false
    }
  }, [url, tipo])
  return s.url === url ? s : { carregando: true }
}

// O conteúdo vem de terceiros e a sessão fica no localStorage: remove script e afins antes de renderizar
function limpar(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script, style, iframe, object, embed, link, meta, base, form').forEach((el) => el.remove())
  doc.body.querySelectorAll('*').forEach((el) => {
    for (const { name, value } of [...el.attributes]) {
      // data: só passa em src (imagens embutidas); em href seria um vetor de XSS
      const perigoso = name === 'src' ? /^\s*(javascript|vbscript):/i : /^\s*(javascript|data|vbscript):/i
      if (name.startsWith('on') || (['href', 'src', 'action'].includes(name) && perigoso.test(value))) {
        el.removeAttribute(name)
      }
    }
    if (el.tagName === 'A' && /^https?:/i.test(el.getAttribute('href') || '')) {
      el.target = '_blank'
      el.rel = 'noopener noreferrer'
    }
  })
  return doc.body.innerHTML
}

// ---------- Rota: #/docs/<slug>/<caminho do artigo, com #âncora opcional> ----------

function lerRota(path) {
  const [, , slug = '', ...resto] = path.split('/')
  return { slug, artigo: resto.join('/') }
}
const hrefDoc = (slug, artigo = '') => `#/docs/${slug}${artigo && '/' + artigo}`

// ---------- Componente ----------

export function ExploradorDocs({ path }) {
  const { slug: slugPedido, artigo } = lerRota(path)
  const [busca, setBusca] = useState('')
  const catalogo = useBusca('/devdocs-catalog/docs.json')

  // o catálogo do DevDocs repete alguns slugs (bun, vitest) com uma versão antiga: fica a primeira
  const docs = useMemo(() => {
    const vistos = new Set()
    return (catalogo.data || []).filter((d) => !vistos.has(d.slug) && vistos.add(d.slug))
  }, [catalogo.data])
  // "#/docs/python" → python~3.13 (o do curso); sem destaque, a primeira versão do catálogo
  const doc =
    docs.find((d) => d.slug === slugPedido) ||
    docs.find((d) => d.slug === PRINCIPAIS.find((p) => p.split('~')[0] === slugPedido)) ||
    docs.find((d) => d.slug.split('~')[0] === slugPedido)
  const slug = doc?.slug
  const indice = useBusca(slug && `/devdocs-content/${slug}/index.json`)

  const q = busca.trim().toLowerCase()
  const bate = (nome) => nome.toLowerCase().includes(q)
  const principais = PRINCIPAIS.map((s) => docs.find((d) => d.slug === s)).filter(Boolean)
  const outras = docs.filter((d) => !PRINCIPAIS.includes(d.slug))

  const itemDoc = (d) => {
    const aberta = d.slug === slug
    return (
      <li key={d.slug}>
        <a
          className="lado-item devdocs-tec"
          href={aberta ? '#/docs' : hrefDoc(d.slug)}
          aria-current={aberta ? 'true' : undefined}
          aria-expanded={aberta}
        >
          {d.name}
          {d.release && <span>{d.release}</span>}
        </a>
        {aberta && !q && <Topicos indice={indice} slug={slug} artigo={artigo} />}
      </li>
    )
  }

  const achados = q ? docs.filter((d) => bate(d.name) || bate(d.slug)) : []
  const entradasAchadas = q && indice.data ? indice.data.entries.filter((e) => bate(e.name)) : []

  return (
    <div className="shell devdocs-shell">
      <aside className="lombada devdocs-sidebar">
        <a className="btn devdocs-voltar" href="#/">
          ← Voltar à página inicial
        </a>
        <form className="lado-busca" role="search" onSubmit={(e) => e.preventDefault()}>
          <Icone nome="busca" />
          <input type="search" placeholder="Pesquisar"aria-label="Buscar documentações ou tópicos" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </form>

        <nav aria-label="Documentações">
          {catalogo.carregando && <p className="devdocs-aviso">Carregando catálogo…</p>}
          {catalogo.erro && <p className="devdocs-aviso" role="alert">{catalogo.erro.message}</p>}

          {q ? (
            <>
              {slug && (
                <>
                  <p className="lado-secao">Em {doc.name}</p>
                  <ListaEntradas entradas={entradasAchadas} slug={slug} artigo={artigo} />
                </>
              )}
              <p className="lado-secao">Documentações</p>
              <ul>{achados.map(itemDoc)}</ul>
              {achados.length === 0 && <p className="devdocs-aviso">Nada encontrado.</p>}
            </>
          ) : (
            <>
              <p className="lado-secao">Principais</p>
              <ul>{principais.map(itemDoc)}</ul>
              {outras.length > 0 && (
                <details className="devdocs-todas" open={doc && !principais.includes(doc) ? true : undefined}>
                  <summary className="lado-secao">Todas as documentações ({docs.length})</summary>
                  <ul>{outras.map(itemDoc)}</ul>
                </details>
              )}
            </>
          )}
        </nav>
      </aside>

      <main className="devdocs-viewer" id="conteudo" tabIndex={-1}>
        <Leitor doc={doc} pedido={slugPedido} catalogoPronto={!catalogo.carregando} artigo={artigo} indice={indice} />
      </main>
    </div>
  )
}

// ---------- Sidebar: tópicos da tecnologia aberta, agrupados por tipo ----------

function Topicos({ indice, slug, artigo }) {
  if (indice.carregando) return <p className="devdocs-aviso">Carregando tópicos…</p>
  if (indice.erro) return <p className="devdocs-aviso" role="alert">{indice.erro.message}</p>

  const grupos = new Map()
  for (const e of indice.data.entries) grupos.set(e.type, [...(grupos.get(e.type) || []), e])
  return (
    <div className="devdocs-topicos">
      {[...grupos].map(([tipo, entradas]) => (
        <Tipo key={tipo} tipo={tipo} entradas={entradas} slug={slug} artigo={artigo} />
      ))}
    </div>
  )
}

function Tipo({ tipo, entradas, slug, artigo }) {
  // renderiza os itens só com o grupo aberto: docs grandes têm milhares de entradas
  const [aberto, setAberto] = useState(entradas.some((e) => e.path === artigo))
  return (
    <details open={aberto} onToggle={(e) => setAberto(e.currentTarget.open)}>
      <summary className="devdocs-tipo">
        {tipo} <span>{entradas.length}</span>
      </summary>
      {aberto && <ListaEntradas entradas={entradas} slug={slug} artigo={artigo} />}
    </details>
  )
}

function ListaEntradas({ entradas, slug, artigo }) {
  return (
    <ul className="devdocs-entradas">
      {entradas.slice(0, MAX_RESULTADOS).map((e) => (
        <li key={e.path + e.name}>
          <a className="lado-item" href={hrefDoc(slug, e.path)} aria-current={e.path === artigo ? 'page' : undefined}>
            {e.name}
          </a>
        </li>
      ))}
      {entradas.length > MAX_RESULTADOS && <li className="devdocs-aviso">+{entradas.length - MAX_RESULTADOS} resultados: refine a busca.</li>}
      {entradas.length === 0 && <li className="devdocs-aviso">Nada encontrado.</li>}
    </ul>
  )
}

// ---------- Painel de leitura ----------

function Leitor({ doc, pedido, catalogoPronto, artigo, indice }) {
  const slug = doc?.slug
  const [caminho, ancora] = artigo.split('#')
  const pagina = useBusca(slug && caminho && `/devdocs-content/${slug}/${caminho}.html`, 'text')
  const corpo = useRef(null)
  const html = useMemo(() => (pagina.data !== undefined ? limpar(pagina.data) : null), [pagina.data])

  // abre no #âncora pedido ou volta ao topo ao trocar de página
  useEffect(() => {
    const alvo = ancora && corpo.current?.querySelector(`[id="${CSS.escape(ancora)}"]`)
    if (alvo) alvo.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [html, ancora])

  if (!slug) {
    return catalogoPronto ? (
      <p className="devdocs-vazio">{pedido ? `Documentação "${pedido}" não encontrada.` : 'Escolha uma documentação na lista ao lado.'}</p>
    ) : null
  }

  const entrada = indice.data?.entries.find((e) => e.path === artigo) || indice.data?.entries.find((e) => e.path.split('#')[0] === caminho)
  const migalhas = [doc.name, entrada?.type, entrada?.name].filter((m, i, todas) => m && m !== todas[i - 1])

  function aoClicar(e) {
    const a = e.target.closest('a')
    const href = a?.getAttribute('href')
    if (!href || /^(https?:|mailto:)/i.test(href)) return // externos abrem em nova aba
    e.preventDefault()
    if (href.startsWith('#')) {
      corpo.current.querySelector(`[id="${CSS.escape(href.slice(1))}"]`)?.scrollIntoView()
      return
    }
    // links internos são relativos à página atual, sem a extensão .html
    const alvo = new URL(href, `http://docs/${slug}/${caminho}`)
    const prefixo = `/${slug}/`
    if (alvo.pathname.startsWith(prefixo)) window.location.hash = hrefDoc(slug, decodeURIComponent(alvo.pathname.slice(prefixo.length)) + alvo.hash).slice(1)
  }

  return (
    <article className="devdocs-pagina">
      <nav className="devdocs-trilha" aria-label="Você está em">
        {migalhas.map((m, i) => (
          <span key={i}>
            {i > 0 && ' ▸ '}
            {m}
          </span>
        ))}
      </nav>

      {!caminho && (
        <div className="devdocs-conteudo">
          <h1>{doc.name}</h1>
          <p>
            Escolha um tópico na lista ao lado ou use a busca.
            {doc.links?.home && (
              <>
                {' '}
                Site oficial:{' '}
                <a href={doc.links.home} target="_blank" rel="noopener noreferrer">
                  {doc.links.home}
                </a>
              </>
            )}
          </p>
        </div>
      )}
      {caminho && pagina.carregando && <p className="devdocs-vazio">Carregando…</p>}
      {caminho && pagina.erro && (
        <p className="erro" role="alert">
          {pagina.erro.message}
        </p>
      )}
      {html !== null && (
        // eslint-disable-next-line react/no-danger -- html passou por limpar()
        <div ref={corpo} className="devdocs-conteudo" onClick={aoClicar} dangerouslySetInnerHTML={{ __html: html }} />
      )}
      {doc.attribution && <p className="devdocs-atribuicao" dangerouslySetInnerHTML={{ __html: limpar(doc.attribution) }} />}
    </article>
  )
}
