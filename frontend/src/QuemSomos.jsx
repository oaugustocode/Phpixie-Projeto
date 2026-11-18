const MEMBROS = [
  ['Matheus Augusto Gomes de Andrade', '221621'],
  ['William Xavier Ribeiro', '221852'],
]

export function QuemSomos() {
  return (
    <article className="pagina">
      <h1 className="titulo-grande">Quem somos</h1>
      <p className="lead">A Central de Programadores é um projeto de faculdade feito em dupla.</p>
      <ul className="linhas">
        {MEMBROS.map(([nome, ra]) => (
          <li key={ra} className="linha">
            <span className="linha-titulo">{nome}</span>
            <span className="linha-meta">RA {ra}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
