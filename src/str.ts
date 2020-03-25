export const insertAt = (
  insertion: string,
  src: string,
  start: number,
  end: number = start
) => src.substring(0, start) + insertion + src.substring(end);