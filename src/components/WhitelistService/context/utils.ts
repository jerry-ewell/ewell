import { MODAL_ACTION_TYPE } from '../types';

export type BasicActions = {
  dispatch: (actions: { type: string; payload: any }) => void;
  handleModalAction: (action: MODAL_ACTION_TYPE, modalState?: any) => void;
};
export const basicActions = (type: string, payload?: any) => ({
  type,
  payload,
});
