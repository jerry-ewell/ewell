import { ValidateStatus } from 'antd/lib/form/FormItem';
import { useCallback, useState } from 'react';
import { useDebounce } from 'react-use';
import { useWhiteList } from '../context/useWhiteList';
import { getTagInfoFromWhitelist } from './whiteListView';

export type TagNameItemType = {
  validateStatus?: ValidateStatus;
  errorMsg?: string | null;
};
export const useHaveTagName = (tagName?: string) => {
  const [isHas, setHas] = useState<TagNameItemType>({
    validateStatus: 'success',
  });
  const [{ whitelistInfo, contract }] = useWhiteList();
  const fetchHave = useCallback(async () => {
    if (!whitelistInfo?.whitelistHash || !whitelistInfo?.projectId || !tagName) return;
    setHas({
      validateStatus: 'validating',
      errorMsg: '查询中...',
    });
    console.log('fetchHave==', contract);

    const res = await getTagInfoFromWhitelist(
      {
        whitelistId: whitelistInfo?.whitelistHash,
        projectId: whitelistInfo?.projectId,
        tagInfo: {
          tagName,
        },
      },
      contract,
    );

    if (res?.error) {
      setHas({
        validateStatus: 'error',
        errorMsg: res?.errorMessage?.message?.Details || 'Query failed',
      });
      return;
    }
    if (res?.value)
      return setHas({
        validateStatus: 'error',
        errorMsg: '标签已存在',
      });
    setHas({
      validateStatus: 'success',
    });
  }, [contract, tagName, whitelistInfo]);
  useDebounce(fetchHave, 500, [tagName]);

  return isHas;
};
