import { Col, Radio, RadioProps, Row } from 'antd';
import FormItem, { FormItemProps } from 'components/FormItem';
export default function Installment({
  radioList,
  value,
  onChange,
  disabled,
  formList,
}: {
  disabled?: boolean;
  radioList: RadioProps[];
  value?: any;
  onChange?: (value: any) => void;
  formList: FormItemProps[][];
}) {
  const enable = value === true;
  return (
    <>
      <Radio.Group disabled={disabled} value={value} onChange={(v) => onChange?.(v.target.value)}>
        {radioList.map((i, k) => (
          <Radio key={k} {...i} />
        ))}
      </Radio.Group>
      {enable && (
        <Col span={24} style={{ paddingTop: '15px' }}>
          {formList.map((item, key) => {
            return (
              <Row justify="space-between" key={key}>
                {item.map((i, index) => {
                  return (
                    <Col span={11} xs={24} sm={11} key={index}>
                      <FormItem {...i} />
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </Col>
      )}
    </>
  );
}
