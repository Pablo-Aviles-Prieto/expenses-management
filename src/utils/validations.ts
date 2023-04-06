export const keyIsEmptyArray = <T>(data: T, key?: keyof T) => {
  if (!key) {
    return false
  }
  const value = data[key]
  return Array.isArray(value) && value.length === 0
}
