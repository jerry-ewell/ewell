import { useCallback, useMemo } from 'react';
import { useWalletContext } from '.';
import { useWebLogin, WebLoginState } from 'aelf-web-login';

export function useWallet() {
  const [state] = useWalletContext();
  const { login, logout, loginState } = useWebLogin();

  const wallet = useMemo(() => {
    return state.wallet;
  }, [state]);
  const isLogin = useMemo(() => loginState === WebLoginState.logining || !!wallet, [loginState, wallet]);

  return {
    wallet,
    isLogin,
    login,
    logout,
  };
}
