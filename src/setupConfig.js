const validOptions = new Set(['url', 'history', 'storage'])

export default function setupConfig (config) {
  const result = {
    url: [],
    history: [],
    storage: [],
    keys: []
  }

  for (let key in config) {
    let syncOptions = config[key]
    syncOptions = Array.isArray(syncOptions) ? syncOptions : [syncOptions]
    setupSyncOptions(key, syncOptions, result)
  }
  return result
}

function setupSyncOptions (key, options, result) {
  if (!options.length) {
    throw new Error(
      `Invalid options for ${key}, it should not be an empty array.`
    )
  }
  for (let option of options) {
    if (!validOptions.has(option)) {
      throw new Error(`'${options}' is not a valid option for ${key}.`)
    }
    result[option].push(key)
  }
  result.keys.push(key)
}
