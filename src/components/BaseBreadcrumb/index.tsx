import { Breadcrumb, BreadcrumbItemProps, BreadcrumbProps } from 'antd';
import clsx from 'clsx';
import IconFont from 'components/IconFont';
import { Icons } from 'constants/iconfont';
import { useNavigate } from 'react-router-dom';
const { Item: BreadcrumbItem } = Breadcrumb;
import './styled.less';

const list = [
  {
    href: '/',
    children: <IconFont type={Icons.overview} />,
  },
  {
    href: '/project-list',
    children: 'Projects',
  },
  {
    href: '',
    children: 'Project details',
  },
];

interface BaseBreadcrumbProps extends BreadcrumbProps {
  itemList?: BreadcrumbItemProps[];
}

export default function BaseBreadcrumb({ itemList = list, ...props }: BaseBreadcrumbProps) {
  const navigate = useNavigate();
  return (
    <Breadcrumb
      {...props}
      separator={props?.separator || <span className="separator"></span>}
      className={clsx('font-size-2 base-breadcrumb-wrapper', props.className)}>
      {itemList.map((item) => (
        <BreadcrumbItem {...item} href={undefined} onClick={() => navigate(item.href ?? '')} key={item.href} />
      ))}
    </Breadcrumb>
  );
}
