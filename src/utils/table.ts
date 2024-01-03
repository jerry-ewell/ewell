export function getSkipCount(loadNumber: number, page?: number) {
  return page && page > 0 ? page * loadNumber : 0;
}
