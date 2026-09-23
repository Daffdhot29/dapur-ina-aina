// inertia/lib/api.ts

function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split('=')

    if (key === name) {
      return decodeURIComponent(value.join('='))
    }
  }

  return null
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase()

  const headers = new Headers(init.headers)

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  if (
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
  ) {
    const csrfToken = getCookie('XSRF-TOKEN')

    if (csrfToken) {
      headers.set('X-XSRF-TOKEN', csrfToken)
    }
  }

  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set(
      'Content-Type',
      'application/json'
    )
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: 'same-origin',
  })
}