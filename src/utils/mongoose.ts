export const ignoreCapsQuery = (data: string) => {
  return { $regex: new RegExp(`^${data}$`, 'i') }
}
