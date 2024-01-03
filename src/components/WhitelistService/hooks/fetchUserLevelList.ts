import { Dispatch } from 'react';
import { basicWhiteListView } from '../context/actions';
import { request } from '../request';
import { formatObjEmpty, getSkipCount } from '../utils';

export const fetchUserLevelList = async (
  dispatch: Dispatch<any>,
  data?: any,
  page?: number,
  pageSize = 999,
  isUpdate?: boolean,
) => {
  try {
    const skipCount = getSkipCount(pageSize, page);
    const maxResultCount = skipCount + pageSize;
    const list = await request.getTags({
      params: formatObjEmpty({
        ...data,
        skipCount,
        maxResultCount,
      }),
    });
    if (list) {
      list?.items &&
        dispatch(
          basicWhiteListView.updateCommonList.actions(
            'userLevelList',
            list?.items,
            list?.totalCount,
            skipCount,
            isUpdate,
          ),
        );
      // dispatch(basicWhiteListView.updateState.actions({ initViewTool: { tag: data?.tag, search: data?.search } }));
    }
  } catch (error) {
    console.debug(error, '====error');
  }
};
