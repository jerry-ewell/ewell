import { ChainConstants } from 'constants/ChainConstants';
import { useAEflConnect } from 'hooks/web3';
import { useEffectOnce } from 'react-use';
import { sleep } from 'utils';

export default function AElfReactManager({ children }: { children: JSX.Element }) {
  const connect = useAEflConnect();
  useEffectOnce(() => {
    if (ChainConstants.chainType === 'ELF') Promise.race([connect(), sleep(5000)]);
  });
  return children;
}
