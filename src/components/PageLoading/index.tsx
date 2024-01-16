import { useState, useCallback, useEffect } from 'react';
import { eventBus } from 'aelf-web-login';
import { Modal } from 'antd';
import { SET_GLOBAL_LOADING } from 'constants/events';

export interface ILoadingInfo {
  isLoading: boolean;
  text: string;
}

const DEFAULT_LOADING_TEXT = 'Loading...';

export default function PageLoading() {
  const [loadingInfo, setLoadingInfo] = useState<ILoadingInfo>({
    isLoading: false,
    text: DEFAULT_LOADING_TEXT,
  });

  const setLoadingHandler = useCallback(({ isLoading, text }: ILoadingInfo) => {
    setLoadingInfo({
      isLoading,
      text: text ?? DEFAULT_LOADING_TEXT,
    });
  }, []);

  useEffect(() => {
    eventBus.addListener(SET_GLOBAL_LOADING, setLoadingHandler);
    return () => {
      eventBus.removeListener(SET_GLOBAL_LOADING, setLoadingHandler);
    };
  }, [setLoadingHandler]);

  return (
    <Modal open={loadingInfo.isLoading} footer={null} centered maskClosable={false}>
      {loadingInfo.text}
    </Modal>
  );
}
