export const roundToTwo = (num: number) =>
  Math.round((num + Number.EPSILON) * 100) / 100;
