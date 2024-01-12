import { message } from 'antd';
import { request } from 'api';
import { useCallback, useEffect, useRef, useState } from 'react';
import useInterval from 'hooks/useInterval';
import { useActiveWeb3React } from './web3';
import Web3 from 'web3';
import { getBlockHeight as getAElfBlockHeight } from 'utils/aelfUtils';
export async function getBlockHeight() {
  const blockHeight: any = await (request as any).getCurrentBlockHeight();
  if (!blockHeight || blockHeight?.error) {
    message.error('getCurrencyBlockHeight error');
    return;
  }
  return blockHeight?.latestBlockHeight;
}

export function useCurrentBlockHeight(intervalTime = 15000) {
  const web3 = useRef<Web3>();
  const { library, account, chainId } = useActiveWeb3React();
  const [height, setHeight] = useState<number>();

  // const intervalTimer = useMemo(() => {
  //   if (intervalTime) return intervalTime;
  //   const blockPerDay = ChainConstants.constants.BLOCK_PER_DAY;
  //   return (24 * 60 * 60 * 1000) / blockPerDay;
  // }, [intervalTime]);

  useEffect(() => {
    if (library) web3.current = new Web3(library);
  }, [library]);

  const fetchBlockHeight = useCallback(async () => {
    let blockHeight;
    if (typeof chainId === 'string') {
      blockHeight = await getAElfBlockHeight();
    } else if (web3.current && account) {
      blockHeight = await web3.current.eth.getBlockNumber();
    } else {
      // blockHeight = await getBlockHeight();
    }
    setHeight(isNaN(blockHeight) ? '-' : blockHeight);
  }, [account, chainId]);

  useInterval(fetchBlockHeight, intervalTime, [fetchBlockHeight]);
  return height;
}
