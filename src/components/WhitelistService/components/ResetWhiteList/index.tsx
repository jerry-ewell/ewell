import { message } from 'antd';
import { useWhiteList } from '../../context/useWhiteList';
import { resetWhitelistHandler } from '../../hooks/managersAction';
import { useCallback, useState } from 'react';
import { MODAL_ACTION_TYPE, ResetWhiteListProps } from '../../types';
import CommonModal from '../CommonModal';
import ModalFooter from '../ModalFooter';
import { useRefreshState } from 'components/WhitelistService/context/hooks';
import { messageHTML } from 'utils/aelfUtils';

export default function ResetWhiteList({ whiteListModal }: ResetWhiteListProps) {
  const [{ contract, whitelistInfo }, { handleModalAction }] = useWhiteList();
  const [loading, setLoading] = useState<boolean>();
  const updater = useRefreshState();
  const resetHandler = useCallback(
    async (e) => {
      if (!contract || !whitelistInfo?.whitelistHash || !whitelistInfo?.projectId)
        return message.error('invalid parameter');
      setLoading(true);
      const res = await resetWhitelistHandler(
        {
          whitelistId: whitelistInfo?.whitelistHash,
          projectId: whitelistInfo?.projectId,
        },
        contract,
      );
      setLoading(false);
      if (res?.error) return message.error(res?.error?.message || 'error');
      res?.TransactionId && messageHTML(res?.TransactionId);
      updater();
      console.log('updater=====');
      handleModalAction(MODAL_ACTION_TYPE.HIDE);
      whiteListModal?.onOk?.(e);
    },
    [contract, handleModalAction, updater, whiteListModal, whitelistInfo?.projectId, whitelistInfo?.whitelistHash],
  );

  return (
    <CommonModal
      closable={false}
      leftElement
      {...whiteListModal}
      title={whiteListModal?.title || 'Reset Whitelist'}
      onCancel={(e) => {
        handleModalAction(MODAL_ACTION_TYPE.HIDE);
        whiteListModal?.onCancel?.(e);
      }}>
      {whiteListModal?.children ? (
        whiteListModal?.children
      ) : (
        <p className="reset-tip-content">
          Once confirmed, all the whitelist addresses will be deleted. Please note this is an irreversible process.
        </p>
      )}
      <ModalFooter
        onCancel={() => {
          handleModalAction(MODAL_ACTION_TYPE.HIDE);
        }}
        onConfirm={resetHandler}
        loading={!!loading}
      />
    </CommonModal>
  );
}
