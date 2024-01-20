import { Row } from 'antd';
import clsx from 'clsx';
import IconFont from 'components/IconFont';
import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-use';
import './styles.less';
import { COMMUNITY_LIST, TCommunityItem } from 'constants/community';
const icons = [
  { type: 'icon-telegram', link: '' },
  { type: 'icon-discord', link: '' },
  { type: 'icon-twitter', link: '' },
];
export default function Footer() {
  const { pathname } = useLocation();
  const isHome = useMemo(() => {
    return pathname === '/';
  }, [pathname]);

  const communityJump = useCallback((item: TCommunityItem) => {
    //
  }, []);

  return (
    <footer className={clsx('footer')}>
      <div className="footer-body common-page">
        <div className="footer-row">
          <div className="community-warp">
            <div className="community-title">Community</div>
            <div className="community-icon-list">
              {COMMUNITY_LIST.map((item) => (
                <img
                  className="community-icon"
                  src={item.icon}
                  alt=""
                  onClick={() => {
                    communityJump(item);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="copyright-wrap">© 2023 Ewell IDO, Inc. All rights reserved</div>
        </div>
      </div>
    </footer>
  );
}
