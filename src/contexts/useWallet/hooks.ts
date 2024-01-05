import { useMemo } from 'react';
import { useWalletContext } from '.';
import { useWebLogin } from 'aelf-web-login';

export function useWallet() {
  const [state] = useWalletContext();
  const { login, logout, loginState } = useWebLogin();

  const wallet = useMemo(() => {
    return state.wallet;
  }, [state]);

  return {
    wallet,
    loginState,
    login,
    logout,
  };
}
