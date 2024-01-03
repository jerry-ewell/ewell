export interface RoutesProps {
  path: string;
  exact?: boolean;
  strict?: boolean;
  element: React.ComponentType<any>;
  authComp?: React.ComponentType<any>;
}
export type ChainType = 'ERC' | 'ELF';

export type ChainInfo = {
  prefix: string;
  suffix: string;
  chainId: number;
  rpcUrl: string;
  ethscanType: string;
  exploreUrl: string;
  chainSymbol: string;
  iconUrls: string[];
} & any;
