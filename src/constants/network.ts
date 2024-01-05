const NETWORK_CONFIG_LIST = {
  mainnet: {
    networkType: 'MAIN',
    mainChainId: 'AELF',
    sideChainId: 'tDVV',
    webLoginGraphqlUrl: 'https://dapp-portkey.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql',
    webLoginRequestDefaultsUrl: 'https://did-portkey.portkey.finance',
    webLoginConnectUrl: 'https://auth-portkey.portkey.finance',
  },
  testnet: {
    networkType: 'TESTNET',
    mainChainId: 'AELF',
    sideChainId: 'tDVW',
    webLoginGraphqlUrl: 'https://dapp-portkey.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql',
    webLoginConnectUrl: 'https://auth-portkey-test.portkey.finance',
  },
  test1: {},
};

export const NETWORK_CONFIG = NETWORK_CONFIG_LIST['mainnet'];

export const DEFAULT_CHAIN_ID = NETWORK_CONFIG.sideChainId;
