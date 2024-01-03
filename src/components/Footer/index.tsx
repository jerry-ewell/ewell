import { Row } from 'antd';
import clsx from 'clsx';
import IconFont from 'components/IconFont';
import { useMemo } from 'react';
import { useLocation } from 'react-use';
import './styles.less';
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
  return (
    <footer className={clsx('footer', isHome && 'footer-home')}>
      <div className="footer-body common-page">
        <Row className="footer-row flex-row-center">
          {isHome ? <div>© 2022 Ewell IDO, Inc. All rights reserved.</div> : <div>Ewell IDO</div>}
          <Row className="icon-row">
            {icons.map((i) => (
              <IconFont key={i.type} type={i.type} />
            ))}
          </Row>
        </Row>
      </div>
    </footer>
  );
}
