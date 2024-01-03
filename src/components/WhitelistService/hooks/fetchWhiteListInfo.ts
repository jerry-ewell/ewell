import { message } from 'antd';
import { Dispatch, useEffect } from 'react';
import { basicWhiteListView } from '../context/actions';
import { useWhiteList } from '../context/useWhiteList';
import { request } from '../request';
import { formatObjEmpty, getSkipCount } from '../utils';
import { getWhitelistDetail } from './whiteListView';

export const fetchWhiteListInfo = async (
  // type: 'projectWhiteList'|''
  dispatch: Dispatch<any>,
  data?: any,
  page?: number,
  pageSize = 10,
  isUpdate?: boolean,
) => {
  try {
    const skipCount = getSkipCount(pageSize, page);
    const maxResultCount = skipCount + pageSize;
    const list = await request.getExtraInfos({
      params: formatObjEmpty({
        ...data,
        skipCount,
        maxResultCount,
      }),
    });
    if (list && list?.items) {
      dispatch(
        basicWhiteListView.updateCommonList.actions(
          'whitelistInfoList',
          list?.items,
          list?.totalCount,
          skipCount,
          isUpdate,
        ),
      );
      dispatch(
        basicWhiteListView.updateState.actions({
          initViewTool: { tag: data?.tagHash ?? 'ALL', search: data?.address },
        }),
      );
    }
  } catch (error) {
    console.debug(error, '====error');
  }
};

export const useWhiteListInfoByContract = () => {
  // Only Base whiteList
  const [{ whitelistInfo, contract, refresh }, { dispatch }] = useWhiteList();
  useEffect(() => {
    getWhitelistDetail(whitelistInfo?.whitelistHash ?? '', contract)
      .then((res: any) => {
        if (res === null)
          return dispatch(basicWhiteListView.updateCommonList.actions('whitelistInfoList', [], 0, 0, true));
        if (res?.error) return res?.error?.message && message.error(res?.error?.message);
        if (res?.value?.[0]) {
          const { addressList } = res?.value?.[0] ?? {};
          const item = addressList?.value?.map((val: string) => ({
            address: val,
            key: val,
          }));
          dispatch(
            basicWhiteListView.updateCommonList.actions(
              'whitelistInfoList',
              item,
              addressList?.value?.length ?? 0,
              0,
              true,
            ),
          );
        }
      })
      .catch((e: any) => {
        console.error(e, 'getWhitelistDetail');
      });
  }, [contract, dispatch, whitelistInfo, refresh]);
};
