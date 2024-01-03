import { Input, Radio } from 'antd';
export default function FormRadioAndInput({
  value,
  onChange,
  suffix,
  ...props
}: {
  value?: any;
  onChange?: (value: any) => void;
  suffix?: React.ReactNode;
}) {
  const isRadio = value === 'radio';
  return (
    <Input
      value={isRadio ? '' : value}
      disabled={isRadio}
      onChange={(v) => onChange?.(v.target.value)}
      {...props}
      suffix={
        <>
          {suffix}&nbsp;
          <Radio
            checked={isRadio}
            onClick={() => {
              onChange?.(isRadio ? '' : 'radio');
            }}>
            不限量
          </Radio>
        </>
      }
    />
  );
}
