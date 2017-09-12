export function toQuery (params) {
  const tokens = []
  for (let key in params) {
    const value = params[key]
    if (value !== undefined) {
      tokens.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  }
  return tokens.length ? '?' + tokens.join('&') : ''
}

export function toParams (query) {
  const tokens = query
    .slice(1)
    .split('&')
    .filter(notEmpty)
  const params = {}
  for (let token of tokens) {
    const keyValue = token.split('=')
    params[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1])
  }
  return params
}

function notEmpty (string) {
  return string !== ''
}
