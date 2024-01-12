import AElf from 'aelf-sdk';
import { COMMON_PRIVATE } from 'constants/aelf';

export const getContract = async (endPoint, contractAddress: string, wallet?: any) => {
  if (!wallet) wallet = AElf.wallet.getWalletByPrivateKey(COMMON_PRIVATE);
  const aelf = new AElf(new AElf.providers.HttpProvider(endPoint));
  const contract = await aelf.chain.contractAt(contractAddress, wallet);
  return contract;
};
