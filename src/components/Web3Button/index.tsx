import { Button, ButtonProps } from 'antd';
import { useWallet } from 'contexts/useWallet/hooks';
import { useCallback } from 'react';
import { WebLoginState } from 'aelf-web-login';

interface IWeb3ButtonProps extends ButtonProps {}

export default function Web3Button(props: IWeb3ButtonProps) {
  const { loginState, login } = useWallet();

  const { onClick: _onClick, ...otherProps } = props;
  const onClick = useCallback(
    (e) => {
      if (!_onClick) return;
      console.log('loginState', loginState);
      if (loginState === WebLoginState.logining) return;
      if (loginState === WebLoginState.logined) _onClick(e);
      return login();
    },
    [_onClick, loginState, login],
  );

  return <Button {...otherProps} onClick={onClick} />;
}
