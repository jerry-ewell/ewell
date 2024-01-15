import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';
import { prefixCls } from 'constants/theme';
import WalletProvider from './contexts/useWallet';

import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';
import { ReactNode } from 'react';
import StoreProvider from './contexts/useStore';
import ViewContractProvider from 'contexts/useViewContract';
import { AELFDProvider } from 'aelf-design';

function ContextProviders({ children }: { children?: ReactNode }) {
  return (
    <AELFDProvider prefixCls={prefixCls}>
      <StoreProvider>
        <ViewContractProvider>
          <WalletProvider>{children}</WalletProvider>
        </ViewContractProvider>
      </StoreProvider>
    </AELFDProvider>
  );
}
ReactDOM.render(
  <ContextProviders>
    <App />
  </ContextProviders>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
