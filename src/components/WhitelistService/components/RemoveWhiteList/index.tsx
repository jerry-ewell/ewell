import { useWhiteList } from '../../context/useWhiteList';
import { AddRmWhiteProps, ADD_RM_TYPE, MODAL_ACTION_TYPE } from '../../types';
import CommonModal from '../CommonModal';
import RemoveByUpdate from '../RemoveByUpdate';
import RemoveTable from '../RemoveTable';

interface RemoveWhiteListProps extends AddRmWhiteProps {
  removeType?: ADD_RM_TYPE;
}

export default function RemoveWhiteList({ whiteListModal, removeType, ...props }: RemoveWhiteListProps) {
  const [{ contract, whitelistId, whitelistInfo }, { handleModalAction }] = useWhiteList();
  return (
    <CommonModal
      closable={false}
      {...whiteListModal}
      leftCallBack={() => {
        handleModalAction(MODAL_ACTION_TYPE.HIDE);
        whiteListModal?.leftCallBack?.();
      }}
      leftElement={removeType === ADD_RM_TYPE.Alone ? undefined : false}
      onCancel={(e) => {
        handleModalAction(MODAL_ACTION_TYPE.HIDE);
        whiteListModal?.onCancel?.(e);
      }}>
      {removeType === ADD_RM_TYPE.Alone ? (
        <RemoveTable contract={contract} whitelistId={whitelistId} />
      ) : (
        <RemoveByUpdate
          contract={contract}
          whitelistId={whitelistId}
          policyType={whitelistInfo?.strategyType}
          draggerProps={props?.draggerProps}
        />
      )}
    </CommonModal>
  );
}
