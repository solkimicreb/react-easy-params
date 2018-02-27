declare module 'react-easy-params' {
  type primitive = string | boolean | number | null | undefined
  interface PrimitiveObject {
    [key: string]: primitive
  }
  interface ObjectObject {
    [key: string]: primitive | ObjectObject
  }

  const storage:  ObjectObject
  const params: PrimitiveObject
  const path: Array<primitive>

  function setParams(obj: PrimitiveObject): void
  function setStorage(obj: ObjectObject): void
  function setPath(array: Array<primitive>): void
}
