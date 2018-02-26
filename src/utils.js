export function toPathArray (path) {
  return path.split('/').filter(notEmpty)
}

export function toPathString (path) {
  return '/' + path.filter(notEmpty).join('/')
}

export function toQuery (params) {
  const queryTokens = []

  for (let key in params) {
    let value = params[key]
    if (value !== undefined && value !== '') {
      key = encodeURIComponent(key)
      value = encodeURIComponent(JSON.stringify(value))
      queryTokens.push(`${key}=${value}`)
    }
  }
  return queryTokens.length ? '?' + queryTokens.join('&') : ''
}

export function toParams (queryString) {
  const queryTokens = queryString
    .slice(1)
    .split('&')
    .filter(notEmpty)

  const params = {}
  for (let token of queryTokens) {
    const keyValue = token.split('=')
    const key = decodeURIComponent(keyValue[0])
    const value = JSON.parse(decodeURIComponent(keyValue[1]))
    params[key] = value
  }
  return params
}

function notEmpty (token) {
  return token !== ''
}
