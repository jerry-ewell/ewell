import clsx from 'clsx';
import { useCallback } from 'react';
import './styles.less';
import { COMMUNITY_LIST, TCommunityItem } from 'constants/community';

export default function Footer() {
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
