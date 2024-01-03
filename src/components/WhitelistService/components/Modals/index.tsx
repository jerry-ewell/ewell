import { useWhiteList } from '../../context/useWhiteList';
import { MODAL_ACTION_TYPE } from '../../types';
import AddWhiteList from '../AddWhiteList';
import RemoveWhiteList from '../RemoveWhiteList';
import ResetWhiteList from '../ResetWhiteList';
import UserLevelSetting from '../UserLevelSetting';
import ViewTheWhiteList from '../ViewTheWhiteList';

export default function Modals({
  modalAction,
}: {
  modalAction: { action: MODAL_ACTION_TYPE; modalState: any | null };
}) {
  const [{ whitelistInfo }] = useWhiteList();

  return whitelistInfo?.isAvailable ? (
    <>
      {modalAction.action === MODAL_ACTION_TYPE.ADD_WHITELIST && (
        <AddWhiteList
          addType={modalAction?.modalState?.addType}
          // whiteListModal={modalAction?.modalState?.whiteListModal}
          // contract={modalAction?.modalState?.whiteContract ?? contract}
          {...(modalAction?.modalState ?? {})}
        />
      )}
      {modalAction.action === MODAL_ACTION_TYPE.RM_WHITELIST && (
        <RemoveWhiteList removeType={modalAction?.modalState?.addType} {...(modalAction?.modalState ?? {})} />
      )}
      {modalAction.action === MODAL_ACTION_TYPE.RESET_WHITELIST && (
        <ResetWhiteList {...(modalAction?.modalState ?? {})} />
      )}
      {modalAction.action === MODAL_ACTION_TYPE.USER_LEVEL_SETTING && (
        <UserLevelSetting {...(modalAction?.modalState ?? {})} />
      )}
      {modalAction.action === MODAL_ACTION_TYPE.VIEW_THE_WHITELIST && (
        <ViewTheWhiteList {...(modalAction?.modalState ?? {})} />
      )}
    </>
  ) : null;
}
