import BigNumber from 'bignumber.js';
import { ZERO } from 'constants/misc';
import { isValidNumber } from './reg';

const formatDeci = (value: string, pivot: BigNumber, min: BigNumber, maxLength = 8) => {
  if (pivot.gt(0)) {
    if (min.gt(pivot)) return min.toFixed();
    const [, dec] = value.split('.');
    return (dec?.length || 0) >= (maxLength || 8) ? pivot.toFixed(maxLength || 8, 1) : value;
  }
  return value;
};

export function parseMAXInputChange(value: string, max: BigNumber, min: BigNumber, maxLength?: number) {
  const pivot = new BigNumber(value);
  if (max.lt(pivot)) {
    return max.toFixed() || '';
  }
  return formatDeci(value, pivot, min, maxLength);
}
export function parseInputChange(value: string, min: BigNumber, maxLength?: number) {
  const pivot = new BigNumber(value);
  return formatDeci(value, pivot, min, maxLength);
}

export function parseInputNumberChange(value: string, max: number | BigNumber = Infinity, decimal = 8) {
  if (!isValidNumber(value)) return '';
  const pivot = new BigNumber(value);
  const [, dec] = value.split('.');
  if (pivot.isEqualTo(0)) {
    return (dec?.length || 0) >= +decimal ? pivot.dp(+decimal, 1).toFixed() : value;
  }
  const maxLimit = !new BigNumber(max).isNaN() ? max : Infinity;
  if (pivot.gt(0)) {
    return pivot.gt(maxLimit)
      ? maxLimit === Infinity
        ? ''
        : ZERO.plus(maxLimit)
            .dp(+decimal, 1)
            .toFixed()
      : (dec?.length || 0) >= +decimal
      ? pivot.dp(+decimal, 1).toFixed()
      : value;
  } else {
    return '';
  }
}
