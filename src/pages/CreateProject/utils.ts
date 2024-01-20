import { ChainConstants } from 'constants/ChainConstants';
import { InstallmentDecimal, ONE, ZERO } from 'constants/misc';
import { getPriceDecimal } from 'utils';
import { timesDecimals } from 'utils/calculate';
import storages from './storages';
import dayjs, { Dayjs } from 'dayjs';

export function reSetSessionStorage() {
  sessionStorage.setItem(storages.ConfirmTradingPair, JSON.stringify(undefined));
  sessionStorage.setItem(storages.AdditionalInformation, JSON.stringify(undefined));
  sessionStorage.setItem(storages.IDOInfo, JSON.stringify(undefined));
}

export function getInstallments(v: any) {
  if (v.isInstallment) return v;
  return {
    totalPeriod: 1,
    firstDistributeProportion: timesDecimals(100, InstallmentDecimal - 2).toFixed(0),
    restDistributeProportion: 0,
    periodDuration: 0,
  };
}

export function ltTip(n: string | number) {
  return `Please enter a number less than ${n}`;
}

export function gtTip(n: string | number) {
  return `Please enter a number greater than ${n}`;
}
export function intervalTip(l: string | number, r: string | number) {
  return `Please enter a number between ${l} and ${r}!`;
}

export function getInfo(confirmTradingPair: any, projectPanel: any, additionalInfo: any) {
  const toRaiseToken = ChainConstants.constants.AcceptedCurrency?.[confirmTradingPair.acceptedCurrency];
  const crowdFundingIssueToken = { ...confirmTradingPair.tokenInfo, name: confirmTradingPair.tokenName };
  const priceDecimal = getPriceDecimal(crowdFundingIssueToken, toRaiseToken);
  const preSalePrice = timesDecimals(projectPanel.preSalePrice, priceDecimal.toFixed()).toFixed(0);
  const publicSalePrice = timesDecimals(projectPanel.publicSalePrice, priceDecimal.toFixed()).toFixed(0);
  const restDistributeProportion = timesDecimals(projectPanel.restDistributeProportion, InstallmentDecimal - 2).toFixed(
    0,
  );
  const firstDistributeProportion = timesDecimals(
    projectPanel.firstDistributeProportion,
    InstallmentDecimal - 2,
  ).toFixed(0);
  const crowdFundingIssueAmount = timesDecimals(
    projectPanel.crowdFundingIssueAmount,
    crowdFundingIssueToken.decimals,
  ).toFixed(0);

  const minSubscription = timesDecimals(projectPanel.minSubscription, toRaiseToken.decimals).toFixed(0);
  const maxSubscription = timesDecimals(projectPanel.maxSubscription, toRaiseToken.decimals).toFixed(0);
  const periodDuration = ZERO.plus(projectPanel.periodDuration ?? 0)
    .times(60)
    .toFixed(0);
  return {
    ...confirmTradingPair,
    ...projectPanel,
    toRaiseToken,
    crowdFundingIssueToken,
    preSalePrice,
    publicSalePrice,
    restDistributeProportion,
    firstDistributeProportion,
    crowdFundingIssueAmount,
    minSubscription,
    maxSubscription,
    projectCurrency: confirmTradingPair.tokenSymbol?.toUpperCase(),
    additionalInfo: { data: { ...additionalInfo } },
    totalPeriod: ONE.plus(projectPanel.totalPeriod ?? 0).toFixed(),
    periodDuration,
    isBurnRestToken: projectPanel.isBurnRestToken === '1' ? true : false,
  };
}

export function disabledDateBefore(current: Dayjs, target?: Dayjs) {
  const targetDate = target || dayjs();
  return current && current < targetDate.endOf('day').add(-1, 'd');
}

export function disabledTimeBefore(current: Dayjs, target?: Dayjs) {
  if (!current) return {};
  const targetDate = target || dayjs().add(1, 's');
  return {
    disabledHours: () => {
      return current.isAfter(targetDate, 'd') ? [] : new Array(targetDate.hour()).fill('').map((_, k) => k);
    },
    disabledMinutes: () => {
      return current.isAfter(targetDate, 'h') ? [] : new Array(targetDate.minute()).fill('').map((_, k) => k);
    },
    disabledSeconds: () => {
      return current.isAfter(targetDate, 'm') ? [] : new Array(targetDate.second()).fill('').map((_, k) => k);
    },
  };
}
