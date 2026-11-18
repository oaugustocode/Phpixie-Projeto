import { useSession } from './api.js'

const COMO_FUNCIONA = [
  ['1. Leia a documentação', 'Consulte a documentação de PHP, JavaScript, Python, SQL e de outras tecnologias.', '#/docs', 'Explorar documentações'],
  ['2. Por onde começar', 'Cinco canais em português para aprender lógica, linguagens e mercado do zero.', '#/como-comecar', 'Ver canais recomendados'],
  ['3. Registre o que aprendeu', 'Guarde anotações e trechos de código no diário, com status de estudo.', '#/diario', 'Abrir diário'],
  ['4. Monte seu currículo', 'Um guia curto, com modelo pronto, para a primeira vaga.', '#/como-criar-curriculo', 'Ver guia'],
]

export function Home() {
  const primeiroNome = useSession()?.usuario.nome.split(' ')[0]
  return (
    <article className="pagina pagina-larga">
      <p className="categoria">Bem-vindo{primeiroNome && `, ${primeiroNome}`}</p>
      <h1 className="titulo-grande">Central de Programadores</h1>
      <p className="lead">
        Um lugar para quem está aprendendo a programar: documentação das tecnologias, canais recomendados para estudar, um diário
        para as anotações e um guia para montar o currículo.
      </p>

      <section className="bloco">
        <h2>Como funciona</h2>
        <div className="guia-grid-2">
          {COMO_FUNCIONA.map(([titulo, texto, href, acao]) => (
            <div className="guia-card" key={href}>
              <h3>{titulo}</h3>
              <p>{texto}</p>
              <a className="link" href={href}>
                {acao} →
              </a>
            </div>
          ))}
        </div>
      </section>

      <a className="btn" href="#/como-comecar">
        Ver como começar
      </a>
    </article>
  )
}
