export type TradingPair = { tokenSymbol: string; tokenName: string; tokenDecimal: number; crowdFundingToken: string };

export type ConfirmTradingPair = {
  tokenSymbol: string;
  tokenName: string;
  tokenDecimal: number;
  acceptedCurrency: string;
};
