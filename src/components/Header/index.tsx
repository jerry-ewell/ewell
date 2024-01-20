import { Drawer, Modal, Row } from 'antd';
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
import logoSvg from './images/logo.svg';
import userSvg from './images/user.svg';
import walletSvg from './images/wallet.svg';
import projectsSvg from './images/projects.svg';
import logoutSvg from './images/logout.svg';
import arrowSvg from 'assets/images/arrow.svg';
import './styles.less';
import { useWallet } from 'contexts/useWallet/hooks';
import { WebLoginState } from 'aelf-web-login';
import { NETWORK_CONFIG } from 'constants/network';
import { Button, HashAddress } from 'aelf-design';
import { useCheckRoute } from 'hooks';

type TMenuItem = {
  name: string;
  icon?: string;
  content?: string;
  onClick?: () => void;
  children?: TMenuItem[];
  isActive?: boolean;
};

export default function Header() {
  const isMobile = useMobile();
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const isHome = useMemo(() => {
    return pathname === '/';
  }, [pathname]);

  const { login, loginState, logout, wallet } = useWallet();
  const isProjectPage = useCheckRoute('example');

  const menuList: TMenuItem[] = useMemo(
    () => [
      {
        name: 'Projects',
        onClick: () => {
          //
        },
        isActive: isProjectPage,
      },
      {
        name: 'Community',
        children: [
          {
            name: 'Medium',
            icon: arrowSvg,
            content: 'Join this open space for discussion news, and announcements.',
            onClick: () => {
              //
            },
          },
          {
            name: 'X',
            icon: arrowSvg,
            content: "Stay up-to-date with Ewell's new features and projects.",
            onClick: () => {
              //
            },
          },
          {
            name: 'Telegram',
            content: 'Meet the community and get live support.',
            icon: arrowSvg,
            onClick: () => {
              //
            },
          },
        ],
        onClick: () => {
          //
        },
      },
      {
        name: 'Launch with EWELL',
        onClick: () => {
          if (loginState === WebLoginState.logining) return;
          if (loginState === WebLoginState.logined) {
            //
          }
          if (loginState === WebLoginState.initial) return login();
        },
      },
    ],
    [isProjectPage, login, loginState],
  );

  const onWalletClick = useCallback(() => {
    console.log('WebLoginState', loginState);
    if (loginState === WebLoginState.initial) return login();
  }, [login, loginState]);

  return (
    <header className="header">
      <div className="header-body common-page flex-row-center">
        <img
          className="header-logo cursor-pointer"
          src={logoSvg}
          alt="logo"
          onClick={() => navigate('/', { replace: true })}
        />
        <div className="btn-row">
          {!isMobile &&
            menuList.map((menu, menuIdx) => (
              <div className="btn-item-wrap" key={menuIdx}>
                <Button
                  className={clsx('btn-item-box', menu.isActive && 'btn-item-box-active')}
                  type="link"
                  onClick={menu.onClick}>
                  {menu.name}
                  {menu.children && <img className="arrow-wrap " src={arrowSvg} alt="" />}
                </Button>
                {menu.children && (
                  <div className="drawer-wrap">
                    <div className="drawer-wrap-box">
                      {menu.children.map((childMenu, childMenuIdx) => (
                        <div className="child-wrap" onClick={childMenu.onClick} key={childMenuIdx}>
                          <div className="icon-wrap">
                            <img className="icon-box" src={childMenu.icon} alt="" />
                          </div>
                          <div className="child-body-wrap">
                            <span className="child-title">{childMenu.name}</span>
                            <span className="child-content">{childMenu.content}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

          {!isMobile &&
            !isHome &&
            (loginState === WebLoginState.logined ? (
              <div className="my-wrap">
                <div className="my-btn cursor-pointer">
                  <img className="my-icon" src={userSvg} alt="" />
                  <span className="my-label">My</span>
                </div>

                <div className="wallet-drawer">
                  <div className="wallet-drawer-box">
                    <div className="wallet-item-wrap">
                      <img src={walletSvg} alt="" />
                      <div className="wallet-item-body">
                        <span className="wallet-item-title">My Address</span>
                        <div className="wallet-item-content">
                          <HashAddress
                            address={wallet?.walletInfo.address || ''}
                            preLen={8}
                            endLen={9}
                            hasCopy
                            chain={NETWORK_CONFIG.sideChainId as any}
                            size="small"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="wallet-item-wrap">
                      <img src={projectsSvg} alt="" />
                      <div className="wallet-item-body">
                        <span className="wallet-item-title">My Projects</span>
                      </div>
                    </div>

                    <div
                      className="wallet-item-wrap"
                      onClick={() => {
                        logout();
                      }}>
                      <img src={logoutSvg} alt="" />
                      <div className="wallet-item-body">
                        <span className="wallet-item-title">Log Out</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Button type="primary" size="medium" className="login-btn" onClick={onWalletClick}>
                Log In
              </Button>
            ))}
        </div>
      </div>
    </header>
  );
}
