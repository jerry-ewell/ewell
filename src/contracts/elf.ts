import BigNumber from 'bignumber.js';
import { ContractBasic } from '../utils/contract';
import { isUserDenied } from '../utils';
import { message } from 'antd';
import { ChainConstants } from 'constants/ChainConstants';
import { LANG_MAX, REQ_CODE } from 'constants/misc';
import i18n from 'i18n';
import { timesDecimals } from 'utils/calculate';
// elf
export const getELFChainBalance = async (tokenContract: ContractBasic, symbol: string, account: string) => {
  const balance = await tokenContract.callViewMethod('GetBalance', {
    symbol: symbol,
    owner: account,
  });
  return balance?.balance ?? balance?.amount ?? 0;
};

export const checkElfChainAllowanceAndApprove = async ({
  tokenContract,
  approveTargetAddress,
  account,
  contractUseAmount,
  pivotBalance,
  symbol,
}: {
  tokenContract: ContractBasic;
  approveTargetAddress: string;
  account: string;
  contractUseAmount?: string | number;
  pivotBalance?: string | number;
  symbol: string;
}): Promise<boolean | any> => {
  const [allowance, info] = await Promise.all([
    tokenContract.callViewMethod('GetAllowance', [symbol, account, approveTargetAddress]),
    tokenContract.callViewMethod('GetTokenInfo', [symbol]),
  ]);
  if (allowance.error) {
    return allowance;
  }
  const allowanceBN = new BigNumber(allowance.allowance ?? allowance.amount ?? 0);
  const pivotBalanceBN = contractUseAmount
    ? new BigNumber(contractUseAmount)
    : timesDecimals(pivotBalance, info.decimals ?? 8);
  if (allowanceBN.lt(pivotBalanceBN)) {
    const approveResult = await tokenContract.callSendMethod('approve', account, [
      approveTargetAddress,
      symbol,
      LANG_MAX.minus(allowanceBN).toFixed(0),
    ]);
    if (approveResult.error) {
      return approveResult;
    } else {
      return approveResult;
    }
  }
  return true;
};
export const checkELFApprove = async (
  symbol: string,
  account: string,
  approveTargetAddress: string,
  contractUseAmount?: string | number,
  pivotBalance?: string | number,
  lpTokenAddress?: string,
): Promise<boolean | any> => {
  const tokenAddress = lpTokenAddress || (ChainConstants.constants?.TOKEN_CONTRACT as string);
  const tokenContract = new ContractBasic({
    contractAddress: tokenAddress,
    aelfContract: ChainConstants.aelfContracts[tokenAddress],
  });

  const approveResult = await checkElfChainAllowanceAndApprove({
    tokenContract,
    approveTargetAddress,
    account,
    contractUseAmount,
    pivotBalance,
    symbol: symbol, // TODO lpTokenAddress ? getLPSymbol(symbol) : symbol,
  });

  if (typeof approveResult !== 'boolean' && approveResult.error) {
    message.error(i18n.t('Approval Failed'));
    message.error(approveResult.error.message);
    if (isUserDenied(approveResult.error.message)) return REQ_CODE.UserDenied;
    return REQ_CODE.Fail;
  }
  return REQ_CODE.Success;
};
