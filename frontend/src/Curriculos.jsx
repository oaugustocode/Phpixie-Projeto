import { useRef, useState } from 'react'

const CORES = [
  ['Fundo', '#FFFFFF'],
  ['Texto', '#111827'],
  ['Destaque', '#1E3A8A'],
]

export function GuiaCurriculo() {
  const [copiado, setCopiado] = useState(false)
  const folha = useRef(null)

  function copiarModelo() {
    navigator.clipboard?.writeText(folha.current.innerText)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  return (
    <article className="pagina pagina-larga guia-cv">
      <p className="categoria">Utilidades dev · Guia rápido</p>
      <h1 className="titulo-grande">Currículo dev em 5 regras</h1>
      <p className="lead">Como passar pelo ATS, pelo RH e pela liderança técnica: mostre resultados, não listas.</p>

      <div className="guia-grid-2">
        <section className="guia-card guia-card-largo">
          <h2>1. Projetos e impacto</h2>
          <p className="guia-formula">
            <code>Ação</code> + <code>Tecnologia</code> + <code>Resultado</code>
          </p>
          <div className="guia-grid-2">
            <p className="guia-exemplo guia-card-ruim">
              <span className="guia-badge guia-badge-ruim">Antes</span>
              &ldquo;Fiz um sistema de prontuários em Python.&rdquo;
            </p>
            <p className="guia-exemplo guia-card-bom">
              <span className="guia-badge guia-badge-bom">Depois</span>
              &ldquo;Criei um sistema desktop em Python + SQLite que reduziu a busca de prontuários de 5–10 min para 1–2 min.&rdquo;
            </p>
          </div>
        </section>

        <section className="guia-card">
          <h2>2. O que o RH quer de um júnior</h2>
          <ul>
            <li>Cargo definido no topo (ex.: Back-end Júnior).</li>
            <li>GitHub organizado, com README em cada projeto.</li>
            <li>Fundamentos sólidos: Git, SQL, HTTP/REST.</li>
            <li>Projetos reais, de preferência no ar.</li>
          </ul>
        </section>

        <section className="guia-card">
          <h2>3. Como passar no ATS</h2>
          <ul>
            <li>Coluna única, sem tabelas nem caixas de texto.</li>
            <li>Palavras-chave exatas da vaga.</li>
            <li>Sem barras, estrelas ou gráficos de nível.</li>
            <li>PDF com texto selecionável.</li>
          </ul>
        </section>

        <section className="guia-card">
          <h2>4. Ordem das seções</h2>
          <ol>
            <li>Cabeçalho e links</li>
            <li>Resumo (3 linhas)</li>
            <li>Formação</li>
            <li>Projetos</li>
            <li>Experiência</li>
            <li>Competências técnicas e cursos</li>
          </ol>
          <p className="guia-alerta-leve">Não coloque: foto, CPF, endereço completo, idade.</p>
        </section>

        <section className="guia-card">
          <h2>5. Fonte e cores</h2>
          <ul className="guia-tabela-lista">
            <li>
              <span>Nome</span> <strong>18–20pt</strong>
            </li>
            <li>
              <span>Títulos de seção</span> <strong>12pt</strong>
            </li>
            <li>
              <span>Texto</span> <strong>10–11pt</strong>
            </li>
            <li>
              <span>Fonte</span> <strong>Arial, Roboto ou Calibri</strong>
            </li>
            {CORES.map(([nome, cor]) => (
              <li key={cor}>
                <span>
                  <span className="amostra-cor" style={{ background: cor }} /> {nome}
                </span>
                <strong>{cor}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="guia-secao">
        <div className="guia-modelo-cabecalho">
          <div>
            <span className="guia-tag">Modelo pronto</span>
            <h2>Currículo júnior no padrão ATS</h2>
          </div>
          <button type="button" className="btn" onClick={copiarModelo}>
            {copiado ? 'Modelo copiado!' : 'Copiar texto do modelo'}
          </button>
        </div>

        {/* Folha de exemplo sempre branca, como o PDF real */}
        <div className="folha-cv" ref={folha} role="region" aria-label="Exemplo visual de currículo dev júnior">
          <header className="folha-cv-topo">
            <h3>MATHEUS AUGUSTO GOMES DE ANDRADE</h3>
            <p className="folha-cv-contato">Araçatuba, SP · (18) 99696-1328 · mycontact.matheusaugusto@gmail.com</p>
            <p className="folha-cv-links">linkedin.com/in/augusto-code · github.com/oaugustocode</p>
          </header>

          <section className="folha-cv-secao">
            <h4>RESUMO PROFISSIONAL</h4>
            <p>
              Estudante de Análise e Desenvolvimento de Sistemas com foco em <strong>backend Python e bancos de dados
              relacionais</strong>. Desenvolvi um sistema desktop com arquitetura em camadas e auditoria a partir de uma
              necessidade real de trabalho, reduzindo o tempo de busca de documentos de 5–10 min para 1–2 min. Busco estágio
              ou posição júnior em desenvolvimento de software.
            </p>
          </section>

          <section className="folha-cv-secao">
            <h4>FORMAÇÃO</h4>
            <div className="folha-cv-item-linha">
              <strong>Centro Universitário Católico Salesiano Auxilium – UniSALESIANO</strong>
              <span>Araçatuba, SP</span>
            </div>
            <div className="folha-cv-item-linha">
              <span>Tecnologia em Análise e Desenvolvimento de Sistemas</span>
              <span>mar. 2025 – previsão: nov. 2027</span>
            </div>
          </section>

          <section className="folha-cv-secao">
            <h4>PROJETOS</h4>
            <div className="folha-cv-item">
              <div className="folha-cv-item-linha">
                <strong>SGPA-CAPS – Sistema de Gestão de Prontuários Antigos</strong>
                <span>Python · CustomTkinter · SQLite · SQL</span>
              </div>
              <ul>
                <li>
                  Desenvolvi uma aplicação desktop para cadastro, consulta e organização de prontuários, com arquitetura em
                  camadas separando interface, lógica de negócio e persistência de dados.
                </li>
                <li>
                  Implementei rotinas de auditoria com logs detalhados de arquivamento e reabertura, registrando data/hora,
                  operador, paciente e número da caixa física.
                </li>
                <li>
                  Reduzi o tempo médio de localização de documentos de <strong>5–10 minutos para cerca de 1–2 minutos</strong>{' '}
                  por prontuário, otimizando a lógica de busca e indexação.
                </li>
              </ul>
            </div>
          </section>

          <section className="folha-cv-secao">
            <h4>EXPERIÊNCIA PROFISSIONAL</h4>
            <div className="folha-cv-item-linha">
              <strong>Zatti Saúde – CAPS IJ</strong>
              <span>Araçatuba, SP</span>
            </div>
            <div className="folha-cv-item-linha">
              <span>Jovem Aprendiz / Auxiliar Administrativo</span>
              <span>abr. 2026 – set. 2026</span>
            </div>
            <ul className="folha-cv-lista-compacta">
              <li>
                Organizei e localizei prontuários físicos, apliquei critérios de indexação e apoiei o fluxo documental da
                equipe, experiência que motivou o desenvolvimento do SGPA-CAPS.
              </li>
              <li>Preparei novos registros e auxiliei nas rotinas administrativas do atendimento em diversos setores.</li>
            </ul>
          </section>

          <section className="folha-cv-secao">
            <h4>COMPETÊNCIAS TÉCNICAS</h4>
            <ul className="folha-cv-lista-compacta">
              <li><strong>Programação:</strong> Python, FastAPI, SQL, arquitetura em camadas</li>
              <li><strong>Banco de dados:</strong> MySQL, SQLite, PostgreSQL, modelagem relacional</li>
              <li><strong>Ferramentas:</strong> Git, GitHub, Power BI, Excel</li>
              <li><strong>Idiomas:</strong> Inglês técnico (leitura de documentação)</li>
            </ul>
          </section>

          <section className="folha-cv-secao">
            <h4>CURSOS</h4>
            <ul className="folha-cv-lista-compacta">
              <li><strong>Power BI e Análise de Dados com IA</strong> – SENAI (em andamento)</li>
              <li><strong>Programação em Inteligência Artificial Generativa</strong> – SENAI (2026)</li>
            </ul>
          </section>
        </div>
      </section>
    </article>
  )
}
