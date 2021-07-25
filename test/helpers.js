export const add = (x, y) => x + y;

export const addAsync = (x, y) =>
  typeof x === 'number' && typeof y === 'number' ? Promise.resolve(x + y) : Promise.reject(new Error('No can do!'));

export const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
