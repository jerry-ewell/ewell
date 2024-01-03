import { Radio, RadioProps } from 'antd';
export default function FormGroup({
  radioList,
  value,
  onChange,
  disabled,
}: {
  disabled?: boolean;
  radioList: RadioProps[];
  value?: any;
  onChange?: (value: any) => void;
}) {
  return (
    <Radio.Group disabled={disabled} value={value} onChange={(v) => onChange?.(v.target.value)}>
      {radioList.map((i, k) => (
        <Radio key={k} {...i} />
      ))}
    </Radio.Group>
  );
}
