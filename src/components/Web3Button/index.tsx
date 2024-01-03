import { Button, ButtonProps } from 'antd';
import { ACTIVE_CHAIN } from 'constants/index';
import { basicModalView } from 'contexts/useModal/actions';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { useActiveWeb3React } from 'hooks/web3';
import { useMemo } from 'react';

interface Web3ButtonProps extends ButtonProps {
  defaultNoConnectText?: string;
}

export default function Web3Button(props: Web3ButtonProps) {
  const { account, chainId } = useActiveWeb3React();
  const modalDispatch = useModalDispatch();

  // TODO: addProps
  const addProps = useMemo(() => {
    if (!account) {
      return {
        children: props?.defaultNoConnectText || 'Connect Wallet',
        disabled: false,
        onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
          e.stopPropagation();
          modalDispatch(basicModalView.setWalletModal.actions(true));
        },
      };
    } else if (!chainId || !ACTIVE_CHAIN[chainId]) {
      return {
        disabled: true,
      };
    }
  }, [account, chainId, modalDispatch, props?.defaultNoConnectText]);
  return <Button {...props} {...addProps} />;
}
