import { ReactNode } from 'react';
import './styles.less';

export interface ICommonCardProps {
  className?: string;
  title: string;
  extra?: ReactNode;
  children?: ReactNode;
}

export default function CommonCard({ className, title, extra, children }: ICommonCardProps) {
  return (
    <div className={`common-card-wrapper ${className || ''}`}>
      <div className="title-wrapper flex-row-center">
        <div className="title flex-1">{title}</div>
        <div className="extra">{extra}</div>
      </div>
      <div className="content-wrapper">{children}</div>
    </div>
  );
}
