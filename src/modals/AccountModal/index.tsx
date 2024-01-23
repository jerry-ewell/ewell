import { UnsupportedChainIdError } from '@web3-react/core';
import { Button, Card, Col, Row } from 'antd';
import { useCallback, useMemo } from 'react';
import { injected } from '../../walletConnectors';
import { SUPPORTED_WALLETS } from '../../constants';
import { getExploreLink, shortenAddress } from '../../utils';
import Copy from '../../components/Copy';
import CommonLink from '../../components/CommonLink';
import CommonModal from '../../components/CommonModal';
import './styles.less';
import { useModal } from 'contexts/useModal';
import { basicModalView } from 'contexts/useModal/actions';
import clsx from 'clsx';
import { useActiveWeb3React, useAEflConnect } from 'hooks/web3';
import { ChainConstants } from 'constants/ChainConstants';
import { useMobile } from 'contexts/useStore/hooks';

function AccountModal() {
  const [{ accountModal }, { dispatch }] = useModal();
  const { connector, account, error, chainId, deactivate } = useActiveWeb3React();
  const connect = useAEflConnect();
  const isMobile = useMobile();
  const filter = useCallback(
    (k) => {
      const { ethereum } = window;
      const isMetaMask = !!(ethereum && ethereum.isMetaMask);
      return (
        SUPPORTED_WALLETS[k].connector === connector && (connector !== injected || isMetaMask === (k === 'METAMASK'))
      );
    },
    [connector],
  );
  const formatConnectorName = useMemo(() => {
    const name = Object.keys(SUPPORTED_WALLETS)
      .filter((k) => filter(k))
      .map((k) => SUPPORTED_WALLETS[k].name)[0];
    return `Connected with ${name}`;
  }, [filter]);
  const connectorIcon = useMemo(() => {
    const icon = Object.keys(SUPPORTED_WALLETS)
      .filter((k) => filter(k))
      .map((k) => SUPPORTED_WALLETS[k].icon)[0];
    return <img style={{ width: '18px', height: '18px' }} src={icon} alt="" />;
  }, [filter]);
  const onDisconnect = useCallback(() => {
    if (typeof connector !== 'string' && connector !== injected) {
      (connector as any).close();
    } else {
      deactivate();
    }
    dispatch(basicModalView.setWalletModal.actions(true));
  }, [connector, deactivate, dispatch]);

  const changeWallet = useCallback(async () => {
    if (ChainConstants.chainType === 'ERC') return dispatch(basicModalView.setWalletModal.actions(true));
    await deactivate();
    dispatch(basicModalView.setAccountModal.actions(false));
    connect();
  }, [connect, deactivate, dispatch]);

  return (
    <CommonModal
      open={accountModal}
      title="Account"
      width="auto"
      className={clsx('modals', 'account-modal')}
      onCancel={() => dispatch(basicModalView.setAccountModal.actions(false))}>
      <p>{formatConnectorName}</p>
      <Card className="account-modal-card">
        <Row justify="space-between">
          {account ? (
            <span className="account-modal-account">
              {connectorIcon} {shortenAddress(account)}
            </span>
          ) : null}
          {error ? (
            <span className="account-modal-account">
              {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error connecting'}
            </span>
          ) : null}
          {account ? (
            <Copy className="account-modal-copy" toCopy={account}>
              Copy Address
            </Copy>
          ) : null}
        </Row>
        {chainId && account ? (
          <CommonLink href={getExploreLink(account, 'address')}>View on explorer.aelf.io</CommonLink>
        ) : null}
      </Card>
      {!isMobile && (
        <Col span={24}>
          <Row justify="space-between" className="account-modal-button">
            <Button type="primary" onClick={onDisconnect}>
              Disconnect
            </Button>
            <Button type="primary" onClick={changeWallet}>
              Change
            </Button>
          </Row>
        </Col>
      )}
    </CommonModal>
  );
}

export default AccountModal;
