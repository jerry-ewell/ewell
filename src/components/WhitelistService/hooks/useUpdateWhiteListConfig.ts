import { useDeepCompareEffect } from 'react-use';
import { basicWhiteListView } from '../context/actions';
import { useWhiteList } from '../context/useWhiteList';
import { WhiteListConfigType } from '../types';

export const useUpdateWhiteListConfig = (v: WhiteListConfigType) => {
  const [, { dispatch }] = useWhiteList();
  useDeepCompareEffect(() => {
    dispatch(basicWhiteListView.updateWhiteListConfig.actions(v));
  }, [v]);
};
