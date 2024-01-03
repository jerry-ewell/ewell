import { Cascader, CascaderProps } from 'antd';
import options from './cities.json';
export default function CityCascader({
  value,
  onChange,
  ...props
}: CascaderProps<any> & {
  value: any;
  onChange: any;
}) {
  return (
    <Cascader
      {...(props as any)}
      value={value?.map((i: any) => i?.label)}
      options={options}
      onChange={(_, p) => onChange(p)}
    />
  );
}
