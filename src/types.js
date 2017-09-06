const toStoreCasters = {
  number: Number,
  boolean: JSON.parse,
  string: String,
  date: date => new Date(parseInt(date)),
  object: JSON.parse
}

const toWidgetCasters = {
  date: date => date.getTime(),
  object: JSON.stringify
}

export function toStoreType (prop, typeProp) {
  const type = getType(typeProp)
  const caster = toStoreCasters[type]
  return caster ? caster(prop) : prop
}

export function toWidgetType (prop, allowObjectType) {
  const type = getType(prop)
  if (!allowObjectType && type === 'object' && prop !== null) {
    throw new TypeError(`${prop} must be a primitive or a date.`)
  }
  const caster = toWidgetCasters[type]
  return caster ? caster(prop) : prop
}

function getType (prop) {
  let type = (typeof prop)
  if (type === 'object' && (prop instanceof Date)) {
    type = 'date'
  }
  return type
}
