export function Estado({ loading, error, reload }) {
  if (error)
    return (
      <div className="estado" role="alert">
        <p>{error.message}</p>
        {reload && (
          <button className="btn btn-linha" onClick={reload}>
            Tentar de novo
          </button>
        )}
      </div>
    )
  if (loading) return <p className="estado">Carregando…</p>
  return null
}
