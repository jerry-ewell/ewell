import { Button, Divider, message, Switch } from 'antd';
import { useHandleAction, useManagerAction, useWhiteList } from 'components/WhitelistService';
import { useProjectInfo } from 'contexts/useProjectInfo';
import { basicProjectInfoView } from 'contexts/useProjectInfo/actions';
import { useMobile } from 'contexts/useStore/hooks';
import { useActiveWeb3React } from 'hooks/web3';
import { useCallback, useEffect, useState } from 'react';
import { PROGRESS_RATE } from 'types/project';
import { messageHTML } from 'utils/aelfUtils';
import { showModal } from 'utils/modal';
import './styles.less';

export default function WhitelistManagement() {
  const { account } = useActiveWeb3React();
  const [switchChecked, setSwitchChecked] = useState<boolean>();
  const [switchLoading, setSwitchLoading] = useState<boolean>();
  const {
    addWhiteList,
    addWhiteListBatch,
    updateState,
    removeWhiteList,
    removeWhiteListBatch,
    viewTheWhiteList,
    resetWhiteList,
  } = useHandleAction();
  const { enableWhiteList, disableWhiteList } = useManagerAction();
  const isMobile = useMobile();
  const [{ idoInfo, idoContract }, { dispatch }] = useProjectInfo();
  const [{ whitelistInfo: whitelist }] = useWhiteList();
  console.log(whitelist, 'whitelist===');

  const onOk = useCallback(async () => {
    if (!idoContract || !account || !idoInfo?.hash) {
      message.error('invalid parameter');
      return Promise.reject('');
    }
    const cancelRes = await idoContract?.callSendMethod('Cancel', account, idoInfo?.hash);
    if (cancelRes?.error) {
      message.error(cancelRes?.error?.message ?? 'cancel error');
      return Promise.reject('');
    }
    cancelRes?.TransactionId && messageHTML(cancelRes?.TransactionId);
    dispatch(basicProjectInfoView.updateRefresh.actions());
    return Promise.resolve('');
  }, [account, dispatch, idoContract, idoInfo?.hash]);

  useEffect(() => {
    setSwitchChecked(whitelist?.isAvailable);
  }, [whitelist?.isAvailable]);
  console.log(whitelist, 'whitelist====');

  const switchChange = useCallback(
    async (checked: any, e: any) => {
      e.preventDefault();
      setSwitchLoading(true);
      const res = await (whitelist?.isAvailable ? disableWhiteList() : enableWhiteList());
      setSwitchLoading(false);
      if (res?.error) return message.error(res?.error?.message ?? 'operation failed');
      if (!res.error) {
        setSwitchChecked(checked);
        message.success('success');
      }
      updateState();
    },
    [disableWhiteList, enableWhiteList, updateState, whitelist?.isAvailable],
  );

  return idoInfo && account === idoInfo?.creator ? (
    <div className="common-card project-setting-wrapper">
      <h4 className="action-card-title">Project Settings</h4>
      <>
        <>
          <h5 className="flex-between-center project-title">
            Whitelist
            <Switch
              checked={!!switchChecked}
              loading={switchLoading}
              checkedChildren="on"
              unCheckedChildren="off"
              className="whitelist-switch"
              onClick={switchChange}
            />
          </h5>
          {whitelist?.isAvailable && (
            <Button
              className="view-whitelist-btn"
              type="primary"
              onClick={() =>
                viewTheWhiteList({
                  whiteListModal: {
                    className: 'whitelist-detail-wrapper',
                    title: 'Whitelist Details',
                  },
                })
              }>
              Whitelist Details
            </Button>
          )}
          {isMobile && <Divider className="divider1" />}
        </>

        <>
          {whitelist?.isAvailable && (
            <>
              <h5 className="project-title">Whitelist Management</h5>
              {!isMobile && <Divider />}
              <Button
                key="add-white"
                className="add-white-btn"
                type="primary"
                onClick={() =>
                  addWhiteList({
                    whiteListModal: {
                      title: 'Add Users',
                      width: 600,
                      className: 'add-whitelist-modal',
                    },
                  })
                }>
                Add Users
              </Button>
              <div className="btn-link">
                <span
                  onClick={() =>
                    addWhiteListBatch({
                      whiteListModal: {
                        title: 'Mass Add',
                        width: 600,
                        className: 'whitelist-batch-modal',
                      },
                    })
                  }>
                  Upload CSV File
                </span>
              </div>
              <Button
                type="primary"
                key="delete-white"
                onClick={() => {
                  removeWhiteList({
                    whiteListModal: {
                      title: 'Remove Users',
                    },
                  });
                }}>
                Remove Users
              </Button>
              <div className="btn-link">
                <span
                  onClick={() =>
                    removeWhiteListBatch({
                      whiteListModal: {
                        title: 'Mass Delete',
                        width: 600,
                        className: 'whitelist-batch-modal',
                      },
                    })
                  }>
                  Upload CSV File
                </span>
              </div>
              <Button
                type="default"
                onClick={() =>
                  resetWhiteList({
                    whiteListModal: {
                      className: 'reset-whitelist-modal',
                      width: 600,
                    },
                  })
                }>
                Reset Whitelist
              </Button>
            </>
          )}
          {(idoInfo?.progressRate === PROGRESS_RATE.comingSoon || idoInfo?.progressRate === PROGRESS_RATE.onGoing) && (
            <>
              <Divider className="divider-manage" />
              <div className="btn-link error-link">
                <span
                  onClick={() => {
                    showModal({
                      title: 'Cancel IDO',
                      width: isMobile ? '22.8571rem' : 600,
                      className: 'project-manner-modal',
                      content: 'Confirm to cancel the IDO and return received funds to investors.',
                      onOk,
                    });
                  }}>
                  Cancel IDO
                </span>
              </div>
            </>
          )}
        </>
      </>
    </div>
  ) : null;
}
