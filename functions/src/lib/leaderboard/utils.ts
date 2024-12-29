export const swap = (ranking: object[], idx1: number, id2: number) => {
  const temp = ranking[idx1];
  ranking[idx1] = ranking[id2];
  ranking[id2] = temp;
};
