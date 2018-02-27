declare module 'react-easy-params' {
  const storage: object
  const params: object
  const path: Array<any>

  function setStorage(obj: storage): void
  function setParams(obj: params): void
  function setPath(array: path): void
}
