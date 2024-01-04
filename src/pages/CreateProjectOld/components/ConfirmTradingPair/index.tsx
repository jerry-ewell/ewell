import { Col, Form, message } from 'antd';
import FormItem, { FormItemProps } from 'components/FormItem';
import { getInputOptions } from 'components/FormItem/utils';
import Web3Button from 'components/Web3Button';
import { useToken } from 'hooks/tokens';
import useDebounce from 'hooks/useDebounce';
import { useActiveWeb3React } from 'hooks/web3';
import { TradingPair } from 'pages/CreateProjectOld/types';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

const initialValues = { acceptedCurrency: 'ELF' };

const fromList: FormItemProps[] = [
  getInputOptions({ label: 'Token symbol', name: 'tokenSymbol' }),
  getInputOptions({
    label: 'Token name',
    name: 'tokenName',
    childrenProps: { placeholder: '', disabled: true },
    rules: [{ required: true, message: `Token not exist!` }],
  }),
  getInputOptions({
    label: 'The minimum unit of the token (decimal places)',
    name: 'tokenDecimal',
    childrenProps: { placeholder: '', disabled: true },
    rules: [{ required: true, message: `Token not exist!` }],
  }),
  {
    type: 'select',
    label: 'Purchase with',
    name: 'acceptedCurrency',
    rules: [{ required: true, message: 'Please select Purchase with!' }],
    childrenProps: {
      placeholder: 'Please select Purchase with',
      list: [{ title: 'ELF', value: 'ELF' }],
    },
    extra: 'The token that will be used to purchase your token.',
  },
];
const ConfirmTradingPair = forwardRef(
  (
    {
      onNext,
      tradingPair,
      setTradingPair,
    }: { onNext: () => void; tradingPair?: TradingPair; setTradingPair: (v?: TradingPair) => void },
    ref,
  ) => {
    const { account } = useActiveWeb3React();
    const [from] = Form.useForm();
    const [tokenSymbol, setTokenSymbol] = useState(tradingPair?.tokenSymbol);
    const debounceSymbol = useDebounce(tokenSymbol);
    const tokenInfo = useToken(debounceSymbol);
    useImperativeHandle(
      ref,
      () => ({
        setFieldsValue: from.setFieldsValue,
      }),
      [from],
    );
    useEffect(() => {
      const symbol = from.getFieldValue('tokenSymbol');
      const upperSymbol = symbol?.toUpperCase();
      if ((tokenInfo && upperSymbol === tokenInfo.symbol) || tradingPair?.tokenSymbol === upperSymbol) {
        if (tokenInfo) from.setFieldsValue({ tokenName: tokenInfo.tokenName, tokenDecimal: tokenInfo.decimals });
      } else {
        from.setFieldsValue({ tokenName: undefined, tokenDecimal: undefined });
      }
    }, [debounceSymbol, from, tradingPair, tokenInfo]);
    return (
      <Form
        form={from}
        {...layout}
        name="information"
        autoComplete="off"
        initialValues={initialValues}
        onValuesChange={(v) => {
          const symbol = v.tokenSymbol;
          if (symbol) {
            setTokenSymbol(symbol.toUpperCase());
            if (symbol === tokenInfo?.symbol)
              from.setFieldsValue({ tokenName: tokenInfo?.tokenName, tokenDecimal: tokenInfo?.decimals });

            if (tradingPair && v.tokenSymbol !== tradingPair.tokenSymbol) setTradingPair(undefined);
          }
        }}
        onFinish={(v) => {
          if (!account) return;
          if (tokenInfo?.issuer !== account)
            return message.error(`Token ${tokenInfo?.symbol}'s issuer not ${account}.`);

          setTradingPair({ ...v, tokenSymbol: v.tokenSymbol.toUpperCase(), tokenInfo });
          onNext();
        }}>
        <Col span={24}>
          {fromList.map((i, k) => {
            return (
              <Col span={24} key={k}>
                <FormItem {...i} />
              </Col>
            );
          })}
          <Web3Button htmlType="submit" type="primary">
            Continue
          </Web3Button>
        </Col>
      </Form>
    );
  },
);

export default ConfirmTradingPair;
