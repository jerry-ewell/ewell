import { useCallback, useEffect, useState } from 'react';
import { request } from '../request';
import { TagInfoList, TagInfoListDto } from '../types';
import { formatObjEmpty } from '../utils';

interface FetchTagInfoParam {
  whitelistId?: string;
  projectId?: string | null;
  chainId?: number;
  time?: number;
}

export const fetchTagInfoListById = async ({ whitelistId, projectId, chainId }: FetchTagInfoParam) => {
  try {
    if (!whitelistId) return;
    const list = await request.getTags({
      params: formatObjEmpty({
        whitelistHash: whitelistId,
        projectId: projectId,
        chainId,
        skipCount: 0,
        maxResultCount: 999,
      }),
    });

    console.log(list, 'fetchTagInfoListById==');
    if (list && list?.items) {
      // [allTagItem].concat
      const tagList = list.items?.map((item: TagInfoListDto) => ({
        value: item?.tagHash,
        label: item?.name,
      }));
      return tagList;
    }

    return;
  } catch (error) {
    console.log(error, '====error');
  }
};

export const useTagInfoList = (whitelistId?: string, projectId?: string, chainId?: number, time?: number) => {
  const [tagList, setTagList] = useState<TagInfoList[]>([]);
  const fetchTagInfoList = useCallback(async () => {
    try {
      if (!whitelistId) return;
      const res: any = await fetchTagInfoListById({ whitelistId, projectId, chainId });
      res && setTagList(res);
    } catch (error) {
      console.debug(error, '====error');
    }
  }, [whitelistId, projectId, chainId]);
  useEffect(() => {
    console.log('useTagInfoList====');
    fetchTagInfoList();
  }, [fetchTagInfoList, time]);
  return tagList;
};
