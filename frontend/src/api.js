import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

// ---------- Sessão (token + usuário no localStorage) ----------

const listeners = new Set()

function readSession() {
  try {
    return JSON.parse(localStorage.getItem('sessao'))
  } catch {
    return null
  }
}

let session = readSession()

export function setSession(value) {
  session = value
  if (value) localStorage.setItem('sessao', JSON.stringify(value))
  else localStorage.removeItem('sessao')
  listeners.forEach((fn) => fn())
}

export function useSession() {
  return useSyncExternalStore(
    (fn) => (listeners.add(fn), () => listeners.delete(fn)),
    () => session,
  )
}

// ---------- Cliente HTTP ----------

export async function api(path, { method = 'GET', body } = {}) {
  // Content-Type só com corpo: o PHPixie tenta ler JSON de qualquer request com esse header e quebra se vier vazio
  const headers = body ? { 'Content-Type': 'application/json' } : {}
  if (session?.token) headers.Authorization = `Bearer ${session.token}`

  let res
  try {
    res = await fetch(`/api${path}`, { method, headers, body: body && JSON.stringify(body) })
  } catch {
    throw new Error('Sem conexão com o servidor. Confira se o backend está rodando.')
  }
  const data = await res.json().catch(() => null)

  if (res.status === 401 && session) setSession(null) // token expirou: volta para o login
  if (!res.ok) throw new Error(data?.erro || `O servidor respondeu com erro ${res.status}.`)
  return data
}

/** GET com estado de carregando/erro. `path` null = não busca. */
export function useApi(path) {
  const [state, setState] = useState({ data: null, error: null, loading: true })

  const load = useCallback(() => {
    if (!path) return
    setState((s) => ({ ...s, loading: true, error: null }))
    api(path).then(
      (data) => setState({ data, error: null, loading: false }),
      (error) => setState({ data: null, error, loading: false }),
    )
  }, [path])

  useEffect(load, [load])
  return { ...state, reload: load }
}

// ---------- Rotas por hash (#/diario/3) ----------

export function useHashPath() {
  const get = () => window.location.hash.slice(1) || '/'
  return useSyncExternalStore(
    (fn) => (window.addEventListener('hashchange', fn), () => window.removeEventListener('hashchange', fn)),
    get,
  )
}

export const go = (path) => (window.location.hash = path)

export const NIVEL_TRILHA = { iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' }
export const STATUS_ESTUDO = { estudando: 'Estudando', revisar: 'Para revisar', dominado: 'Dominado' }
