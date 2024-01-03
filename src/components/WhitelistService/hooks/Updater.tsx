import { message } from 'antd';
import { useEffect } from 'react';
import { basicWhiteListView } from '../context/actions';
import { useWhiteList } from '../context/useWhiteList';
import { StrategyType } from '../types/contract';
import { getWhiteList } from './whiteListView';

export default function WhiteListUpdater() {
  const [{ whitelistId, contract, refresh }, { dispatch }] = useWhiteList();

  /* Fetch whitelist detail by api */

  // const fetchWhiteList = useCallback(async () => {
  //   if (!whitelistId || !chainId) return;
  //   try {
  //     const res = await request.getWhitelistInfo({
  //       query: `${chainId}/${whitelistId}`,
  //     });
  //     if (!res || res?.error) {
  //       return console.log(res, 'useWhiteListDetail===');
  //     }
  //     dispatch(basicWhiteListView.updateWhiteListInfo.actions(res));
  //     // set
  //   } catch (error: any) {
  //     console.log(error, 'useWhiteListDetail===error');
  //     error?.message && message.error(error?.message);
  //   }
  // }, [chainId, dispatch, whitelistId]);

  // useEffect(() => {
  //   fetchWhiteList();
  // }, [fetchWhiteList]);

  /* Fetch whitelist detail by contract */

  useEffect(() => {
    getWhiteList(whitelistId, contract)
      .then((res) => {
        if (res?.error) return res?.error?.message && message.error(res?.error?.message);
        const info = {
          ...res,
          whitelistHash: res?.whitelistId,
          strategyType: StrategyType.Basic,
        };
        dispatch(basicWhiteListView.updateWhiteListInfo.actions(info));
      })
      .catch((e) => {
        console.error(e, 'getWhiteList==');
      });
  }, [contract, dispatch, whitelistId, refresh]);

  return null;
}
