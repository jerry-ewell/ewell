import { Form, Select, SelectProps } from 'antd';
import clsx from 'clsx';
import { basicWhiteListView } from '../../context/actions';
import { useWhiteList } from '../../context/useWhiteList';
import { fetchTagInfoListById } from '../../hooks/useTagInfoList';
import { allTagItem } from '../../utils/const';
import { useCallback, useEffect, useMemo } from 'react';

interface TagSelectProps extends SelectProps {
  className?: string;
  required?: boolean;
  showAll?: boolean;
}

export default function TagSelect({
  className,
  value,
  required,
  onChange,
  style,
  showAll = false,
  ...props
}: TagSelectProps) {
  const [{ whitelistInfo, chainId, tagInfoList }, { dispatch }] = useWhiteList();
  const fetchTagInfoList = useCallback(async () => {
    try {
      if (!whitelistInfo?.whitelistHash) return;
      const res: any = await fetchTagInfoListById({
        whitelistId: whitelistInfo?.whitelistHash,
        projectId: whitelistInfo?.projectId,
        chainId,
      });
      dispatch(basicWhiteListView.updateState.actions({ tagInfoList: res }));
    } catch (error) {
      console.debug(error, '====error');
    }
  }, [whitelistInfo?.whitelistHash, whitelistInfo?.projectId, chainId, dispatch]);
  useEffect(() => {
    fetchTagInfoList();
  }, [fetchTagInfoList]);
  const selectOption = useMemo(() => {
    if (!showAll) return tagInfoList;
    return [allTagItem, ...(tagInfoList ?? [])];
  }, [showAll, tagInfoList]);
  return (
    <Form.Item
      name="tagId"
      label="标签"
      style={{ marginBottom: 0 }}
      rules={[{ required: required, message: 'Missing tag' }]}>
      <Select
        {...props}
        className={clsx('add-whitelist-tag', className)}
        getPopupContainer={(props) => props?.parentNode ?? document.body}
        options={selectOption ?? []}
        onChange={onChange}
        value={value}
        style={style}
      />
    </Form.Item>
  );
}
