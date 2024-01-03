import { ChainConstants } from 'constants/ChainConstants';
import { provider } from 'web3-core';
import { checkELFApprove } from './elf';
import { checkErcApprove } from './ethereum';

export const checkApprove = async (
  ethereum: provider,
  // ethereum from token address
  // elf from token symbol
  fromToken: string,
  account: string,
  approveTargetAddress: string,
  contractUseAmount?: string | number,
  pivotBalance?: string | number,
  // elf lp token address
  lpTokenAddress?: string,
): Promise<boolean | any> => {
  if (ChainConstants.chainType === 'ELF')
    return checkELFApprove(fromToken, account, approveTargetAddress, contractUseAmount, pivotBalance, lpTokenAddress);
  return checkErcApprove(ethereum, fromToken, account, approveTargetAddress, contractUseAmount, pivotBalance);
};
export * from './elf';
export * from './ethereum';
