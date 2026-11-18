const CANAIS = [
  {
    nome: 'Curso em Vídeo (Gustavo Guanabara)',
    foco: 'Iniciantes do zero · Lógica, Python, JS, HTML/CSS e PHP',
    url: 'https://www.youtube.com/@CursoemVideo',
    descricao:
      'Para quem está começando do zero. O Gustavo Guanabara ensina lógica de programação antes de entrar nas linguagens (Python, JavaScript, HTML/CSS e PHP), com exercícios práticos e apostilas gratuitas.',
  },
  {
    nome: 'Rocketseat',
    foco: 'Mercado de trabalho · Node.js, React e React Native',
    url: 'https://www.youtube.com/@rocketseat',
    descricao:
      'Conteúdo voltado ao mercado de trabalho. As playlists iniciais e os eventos gratuitos, como a NLW, cobrem Node.js, React e React Native.',
  },
  {
    nome: 'Filipe Deschamps',
    foco: 'Mentalidade, boas práticas e arquitetura',
    url: 'https://www.youtube.com/@FilipeDeschamps',
    descricao:
      'Fala de mentalidade de programador, boas práticas e arquitetura. Bom para acompanhar as novidades da área e ver conceitos complexos explicados de forma simples.',
  },
  {
    nome: 'Código Fonte TV (Gabriel e Vanessa)',
    foco: 'Carreira, conceitos e dicionário do programador',
    url: 'https://www.youtube.com/@codigofontetv',
    descricao:
      'Canal de um casal de programadores. Explicam conceitos técnicos de forma leve, têm o quadro "Dicionário do Programador" e orientam sobre quais caminhos e tecnologias escolher.',
  },
  {
    nome: 'Rafaella Ballerini',
    foco: 'Front-end · HTML, CSS, JS, portfólio e carreira',
    url: 'https://www.youtube.com/@rafaellaballerini',
    descricao:
      'Tutoriais práticos de HTML, CSS e JavaScript para Front-end, além de dicas de organização dos estudos, portfólio e transição de carreira.',
  },
]

export function ComoComecar() {
  return (
    <article className="pagina pagina-larga">
      <p className="categoria">Utilidades dev · Recomendações de estudo</p>
      <h1 className="titulo-grande">Como começar</h1>
      <p className="lead">
        Cinco canais gratuitos em português, da lógica de programação até tecnologias de mercado, boas práticas e portfólio.
      </p>

      <ol className="canais-lista">
        {CANAIS.map((canal, i) => (
          <li key={canal.nome} className="canal-card">
            <div className="canal-topo">
              <div className="canal-titulo-bloco">
                <span className="canal-numero" aria-hidden="true">
                  0{i + 1}
                </span>
                <div>
                  <h2>{canal.nome}</h2>
                  <p className="canal-foco">{canal.foco}</p>
                </div>
              </div>
              <a className="btn btn-linha canal-link" href={canal.url} target="_blank" rel="noreferrer">
                Acessar canal →<span className="sr-only"> (abre em nova aba)</span>
              </a>
            </div>
            <p className="canal-descricao">{canal.descricao}</p>
          </li>
        ))}
      </ol>
    </article>
  )
}
