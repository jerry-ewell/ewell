import { Button, Col, Form, FormProps, Row } from 'antd';
import FormItem, { FormItemProps } from 'components/FormItem';
import { getInputOptions } from 'components/FormItem/utils';
import ToTop from 'components/ToTop';
import storages from 'pages/CreateProjectOld/storages';
import { useSessionStorage } from 'react-use';
import { urlRequiredValidator, urlValidator } from 'pages/CreateProjectOld/validate';
import Web3Button from 'components/Web3Button';
import { useActiveWeb3React } from 'hooks/web3';
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

const initialValues = { 上市于: 'AwakenSwap', 资金池: '0.3%', 是否启用白名单: 2, 是否启用分期发放: 2 };
const formList: FormItemProps[][] = [
  [
    getInputOptions({
      label: 'Logo address',
      name: 'logoUrl',
      rules: [{ required: true, validator: urlRequiredValidator }],
    }),
    getInputOptions({
      label: 'Home address',
      name: 'website',
      rules: [{ required: true, validator: urlRequiredValidator }],
    }),
  ],
  [
    getInputOptions({ label: 'Facebook', name: 'facebook', required: false, rules: [{ validator: urlValidator }] }),
    getInputOptions({ label: 'Twitter', name: 'twitter', required: false, rules: [{ validator: urlValidator }] }),
  ],
  [
    getInputOptions({ label: 'Github', name: 'github', required: false, rules: [{ validator: urlValidator }] }),
    getInputOptions({ label: 'Telegram', name: 'telegram', required: false, rules: [{ validator: urlValidator }] }),
  ],
  [
    getInputOptions({ label: 'Instagram', name: 'instagram', required: false, rules: [{ validator: urlValidator }] }),
    getInputOptions({ label: 'Discord', name: 'discord', required: false, rules: [{ validator: urlValidator }] }),
  ],
  [getInputOptions({ label: 'Reddit', name: 'reddit', required: false, rules: [{ validator: urlValidator }] })],
  [
    {
      className: 'input-text-area',
      type: 'textArea',
      label: 'Description',
      name: 'description',
      childrenProps: {
        placeholder: 'Please enter',
      },
      required: false,
      rules: [{ validator: urlValidator }],
    },
  ],
];
export function InformationForm({
  onPre,
  loading,
  disabled,
  ...props
}: FormProps & { onPre?: () => void; loading?: boolean; disabled?: boolean }) {
  return (
    <Form {...props}>
      <Col span={24}>
        {formList.map((list, key) => {
          return (
            <Row key={key} justify="space-between">
              {list.map((i, k) => {
                return (
                  <Col key={k} span={24} xs={24} sm={24}>
                    <FormItem {...i} childrenProps={{ ...i.childrenProps, disabled }} />
                  </Col>
                );
              })}
            </Row>
          );
        })}
        <Row className="form-button-row">
          <Col span={11}>
            <Button htmlType="button" onClick={onPre}>
              Back to the last step
            </Button>
          </Col>
          <Col span={11} offset={2}>
            {/* <Web3Button loading={loading} htmlType="submit" type="primary">
              Continue
            </Web3Button> */}
          </Col>
        </Row>
        <ToTop />
      </Col>
    </Form>
  );
}
export default function AdditionalInformation({ onNext, onPre }: { onNext: () => void; onPre: () => void }) {
  const [from] = Form.useForm();
  const [{ tokenSymbol }] = useSessionStorage<any>(storages.ConfirmTradingPair);
  const [sessionState, setSessionState] = useSessionStorage<any>(storages.AdditionalInformation);
  const { account } = useActiveWeb3React();
  return (
    <InformationForm
      form={from}
      {...layout}
      name="information"
      autoComplete="off"
      initialValues={sessionState?.symbol === tokenSymbol ? sessionState : initialValues}
      onFinish={(v) => {
        if (!account) return;
        setSessionState({ ...v, symbol: tokenSymbol });
        onNext();
      }}
      onPre={onPre}
    />
  );
}
