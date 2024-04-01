export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomInRange(range) {
  return range[getRandomInt(0, range.length - 1)];
}

export function getRandom(min, max, decimals = 2) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}

export function wait(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
