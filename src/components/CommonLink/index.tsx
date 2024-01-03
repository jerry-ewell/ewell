import Icon from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { isUrl } from '../../utils/reg';
import { ReactComponent as LinkIcon } from 'assets/images/link.svg';
import clsx from 'clsx';
import './styles.less';
import { ChainConstants } from 'constants/ChainConstants';
import { useMobile } from 'contexts/useStore/hooks';
export default function CommonLink({
  href,
  children,
  className,
  showIcon = true,
  isTagA,
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  isTagA?: boolean;
}) {
  const isMobile = useMobile();
  const target = ChainConstants.chainType === 'ELF' && isMobile ? '_self' : '_blank';
  if (isTagA)
    return (
      <a target={target} href={href}>
        {children}
      </a>
    );
  return (
    <Button
      className={clsx('common-link', className)}
      disabled={!href || !isUrl(href)}
      onClick={(e) => e.stopPropagation()}
      target={target}
      type="link"
      href={href}>
      {showIcon && <Icon component={LinkIcon} />}
      {children}
    </Button>
  );
}
