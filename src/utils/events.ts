import { eventBus } from 'aelf-web-login';
import { ILoadingInfo } from 'components/PageLoading';
import { SET_GLOBAL_LOADING } from 'constants/events';

export const emitLoading = (isLoading: boolean, loadingInfo?: Omit<ILoadingInfo, 'isLoading'>) =>
  eventBus.emit(SET_GLOBAL_LOADING, {
    isLoading,
    ...loadingInfo,
  });
