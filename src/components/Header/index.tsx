import { Button, Drawer, Row } from 'antd';
import clsx from 'clsx';
import IconFont from 'components/IconFont';
import { ChainConstants } from 'constants/ChainConstants';
import { Icons } from 'constants/iconfont';
import { basicModalView } from 'contexts/useModal/actions';
import { useModalDispatch } from 'contexts/useModal/hooks';
import { useMobile } from 'contexts/useStore/hooks';
import { useActiveWeb3React, useAEflConnect } from 'hooks/web3';
import { useCallback, useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-use';
import { shortenAddress } from 'utils';
import logo from './images/logo.svg';
import './styles.less';

// function MobileDrawer({
//   open,
//   setOpen,
//   noAccount,
// }: {
//   open: boolean;
//   setOpen: (b: boolean) => void;
//   noAccount: () => void;
// }) {
//   const { account } = useActiveWeb3React();
//   const modalDispatch = useModalDispatch();
//   const navigate = useNavigate();
//   return (
//     <Drawer width={'100%'} closable={false} onClose={() => setOpen(false)} open={open} className="header-drawer">
//       <Row
//         className="menu-item"
//         onClick={() => {
//           !account ? noAccount() : modalDispatch(basicModalView.setAccountModal.actions(true));
//         }}>
//         <IconFont type={Icons.user} />
//         {account ? shortenAddress(account) : 'Connect'}
//       </Row>
//       <Row
//         onClick={() => {
//           navigate('/project-list');
//           setOpen(false);
//         }}
//         className="menu-item">
//         <IconFont type={Icons.projects} />
//         Projects
//       </Row>
//       <Row
//         onClick={() => {
//           navigate('/create-project');
//           setOpen(false);
//         }}
//         className="menu-item">
//         <IconFont type={Icons.create} />
//         Create
//       </Row>
//     </Drawer>
//   );
// }

export default function Header() {
  const isMobile = useMobile();
  // const { account } = useActiveWeb3React();
  // const modalDispatch = useModalDispatch();
  const { pathname } = useLocation();
  // const connect = useAEflConnect();
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const isHome = useMemo(() => {
    return pathname === '/';
  }, [pathname]);

  // const noAccount = useCallback(() => {
  //   if (!isMobile || ChainConstants.chainType !== 'ELF')
  //     return modalDispatch(basicModalView.setWalletModal.actions(true));
  //   connect();
  // }, [connect, isMobile, modalDispatch]);

  return (
    <header className="header">
      <div className="header-body flex-row-center">
        <img
          className="header-logo cursor-pointer"
          src={logo}
          alt="logo"
          onClick={() => navigate('/', { replace: true })}
        />
        <Row className="btn-row">
          {!isMobile && !isHome ? (
            <>
              <Button ghost>
                <NavLink to="/project-list">Projects</NavLink>
              </Button>
              <Button ghost>
                <NavLink to="/create-project">Create</NavLink>
              </Button>
            </>
          ) : null}
          {/* {isMobile && account ? (
            isHome ? (
              <IconFont
                type={Icons.user}
                className="user-icon"
                onClick={() => modalDispatch(basicModalView.setAccountModal.actions(true))}
              />
            ) : (
              <IconFont
                type={!open ? Icons.menuIcon : Icons.closeIcon}
                className={clsx('user-icon', 'menu-icon', open && 'close-icon')}
                onClick={() => setOpen(!open)}
              />
            )
          ) : (
            <Button
              ghost
              onClick={() => {
                !account ? noAccount() : modalDispatch(basicModalView.setAccountModal.actions(true));
              }}>
              {account ? shortenAddress(account) : 'Connect'}
            </Button>
          )} */}
        </Row>
      </div>
      {/* {isMobile && <MobileDrawer open={open} setOpen={setOpen} noAccount={noAccount} />} */}
    </header>
  );
}
