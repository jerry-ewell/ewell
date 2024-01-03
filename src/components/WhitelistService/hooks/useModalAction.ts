import { useState, useCallback } from 'react';
import { MODAL_ACTION_TYPE } from '../types';

export function useModalAction<T>() {
  const [modalAction, setModalAction] = useState<{
    action: MODAL_ACTION_TYPE;
    modalState: T | null;
  }>({
    action: MODAL_ACTION_TYPE.HIDE,
    modalState: null,
  });

  const handleModalAction = useCallback((action: keyof typeof MODAL_ACTION_TYPE, modalState: T) => {
    setModalAction({
      action: MODAL_ACTION_TYPE[action],
      modalState,
    });
  }, []);

  const handleModalDestroy = useCallback(() => {
    setModalAction({
      action: MODAL_ACTION_TYPE.HIDE,
      modalState: null,
    });
  }, []);

  return { modalAction, handleModalAction, handleModalDestroy };
}

export { MODAL_ACTION_TYPE };
