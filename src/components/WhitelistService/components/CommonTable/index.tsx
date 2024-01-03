import { Table, TableProps } from 'antd';
import clsx from 'clsx';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
export type CommonTableInstance = {
  onResetPage: () => void;
};

const CommonTable = forwardRef((props: TableProps<any>, ref) => {
  const [page, setPage] = useState(1);
  const onResetPage = useCallback(() => {
    setPage(1);
  }, []);
  useImperativeHandle(ref, () => ({
    onResetPage,
  }));
  return (
    <Table
      {...props}
      className={clsx('whitelist-common-table', props.className)}
      pagination={{
        showQuickJumper: true,
        showTitle: false,
        // hideOnSinglePage: true,
        // showTotal: (total) => `共${total}条记录 第${page}/${Math.ceil(total / 10)}页`,
        current: page,
        position: ['bottomCenter'],
        ...props.pagination,
        onChange: (page: number, pageSize: number) => {
          setPage(page);
          if (props.pagination !== false) props.pagination?.onChange?.(page, pageSize);
        },
      }}
    />
  );
});
export default CommonTable;
