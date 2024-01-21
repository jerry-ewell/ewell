import BigNumber from 'bignumber.js';

export const NumberFormat = (val: string | number, precision: number = 0) => {
  console.log('NumberFormat', new BigNumber(val).toFormat(precision).replace(/\.0+$|(?<=\.\d+)0*$/, ''));
  return new BigNumber(val).toFormat(precision).replace(/\.0+$|(?<=\.\d+)0*$/, '');
};
