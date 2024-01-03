import { useCallback } from 'react';
import { useWhiteList } from '..';
import { basicWhiteListView } from './actions';

export const useRefreshState = () => {
  const [, { dispatch }] = useWhiteList();
  return useCallback(() => dispatch(basicWhiteListView.updateState.actions({ refresh: Date.now() })), [dispatch]);
};
