const add = (x, y) => x + y;

const addAsync = (x, y) =>
  typeof x === 'number' && typeof y === 'number' ? Promise.resolve(x + y) : Promise.reject(new Error('No can do!'));

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

module.exports = { add, addAsync, wait };
