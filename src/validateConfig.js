const validOptions = new Set(['url', 'history', 'storage'])

export default function validateConfig (config) {
  for (let key in config) {
    let syncOptions = config[key]
    syncOptions = Array.isArray(syncOptions) ? syncOptions : [syncOptions]
    validateSyncOptions(key, syncOptions)
    config[key] = syncOptions
  }
  Object.freeze(config)
}

function validateSyncOptions (key, options) {
  if (!options.length) {
    throw new Error(`Invalid options for ${key}, it should not be an empty array.`)
  }
  for (let option of options) {
    if (!validOptions.has(option)) {
      throw new Error(`'${options}' is not a valid option for ${key}.`)
    }
  }
}
