import { Dispatch } from 'react';
import { basicWhiteListView } from '../context/actions';
import { request } from '../request';
import { ProjectWhiteListItemDto } from '../types';
import { getSkipCount } from '../utils';

export const fetchListFilter = async (
  type: 'whitelistInfoList' | 'projectWhiteList',
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
      params: {
        ...data,
        skipCount,
        maxResultCount,
      },
    });
    if (list) {
      const project = list?.items?.map((item: ProjectWhiteListItemDto) => {
        return {
          ...item,
          tagName: item?.tagInfo?.name,
          key: `${item?.address}&${item?.tagInfo?.tagHash ?? ''}`,
        };
      });
      if (project) {
        dispatch(basicWhiteListView.updateCommonList.actions(type, project, list?.totalCount, skipCount, isUpdate));
        dispatch(
          basicWhiteListView.updateState.actions({
            [type === 'projectWhiteList' ? 'initRemoveTool' : 'initViewTool']: {
              tag: data?.tagHash ?? 'ALL',
              search: data?.address,
            },
          }),
        );
      }
    }
  } catch (error) {
    console.debug(error, '====error');
  }
};
