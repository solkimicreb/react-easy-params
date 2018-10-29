declare module 'react-easy-params' {
  type primitive = string | boolean | number | null | undefined
  interface PrimitiveObject {
    [key: string]: primitive
  }
  interface ObjectObject {
    [key: string]: primitive | ObjectObject
  }

  const storage:  ObjectObject
  const url:  ObjectObject
}
