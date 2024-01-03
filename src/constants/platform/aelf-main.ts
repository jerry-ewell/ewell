export const CHAIN_INFO = {
  chainId: 'tDVW',
  exploreUrl: 'https://explorer-test-side02.aelf.io/',
  rpcUrl: 'https://tdvw-test-node.aelf.io',
};

export const TOKEN_CONTRACT = 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx';

export const WHITELIST_CONTRACT = 'aceGtyU2fVcBkViZcaqZXHHjd7eNAJ6NPwbuFwhqv6He49BS1';
export const IDO_CONTRACT = '2tWvBTmX7YhB2HLcWGGG5isVCgab96jdaXnqDs1jzSsyqwmjic';

export const CHAIN_GUID = '1ddac557-9bc6-11ec-a14b-0ee50f750b74';

export const AcceptedCurrency = {
  ELF: {
    symbol: 'ELF',
    decimals: 8,
  },
  USDT: {
    symbol: 'USDT',
    decimals: 6,
  },
};

const EXPAND_CONTRACTS: any = {};
[TOKEN_CONTRACT, IDO_CONTRACT].map((i) => {
  EXPAND_CONTRACTS[i] = i;
});

export const CONTRACTS = {
  ...EXPAND_CONTRACTS,
  WHITELIST_CONTRACT,
  IDO_CONTRACT,
};
