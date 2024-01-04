import { Button, Col, Form, Row } from 'antd';
import FormItem, { FormItemProps } from 'components/FormItem';
import { getInputOptions } from 'components/FormItem/utils';
import storages from 'pages/CreateProjectOld/storages';
import { useSessionStorage } from 'react-use';
import BigNumber from 'bignumber.js';
import Installment from 'components/Installment';
import ToTop from 'components/ToTop';
import { circulationValidator, periodDurationValidator, Validators } from 'pages/CreateProjectOld/validate';
import { numberGtZEROValidator } from 'utils/validate';
import { PriceDecimal, ZERO } from 'constants/misc';
import { RangePickerProps } from 'antd/lib/date-picker';
import dayjs from 'dayjs';
import { ConfirmTradingPair } from 'pages/CreateProjectOld/types';
import { useCallback, useMemo, useState } from 'react';
import Web3Button from 'components/Web3Button';
import { useActiveWeb3React } from 'hooks/web3';

const initialValues = { isEnableWhitelist: false, isInstallment: false };
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };

const isRowName = ['publicSalePrice', 'isInstallment', 'isEnableWhitelist'];
const installmentList: FormItemProps[][] = [
  [
    getInputOptions({
      label: 'Initial distribution (percentage)',
      name: 'firstDistributeProportion',
    }),
    getInputOptions({
      label: 'Terms',
      name: 'totalPeriod',
      extra: 'The initial distribution is not included in the term.',
    }),
  ],
  [
    getInputOptions({
      label: 'Distribution by instalment (percentage)',
      name: 'restDistributeProportion',
      childrenProps: {
        disabled: true,
        placeholder: '',
      },
    }),
    getInputOptions({
      label: 'Distribution period (minutes)',
      name: 'periodDuration',
      rules: [{ required: true, validator: periodDurationValidator }],
    }),
  ],
];

const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current < dayjs().endOf('day').add(-1, 'd');
};
const disabledMinutes = 1;
const disabledTime: any = (current?: dayjs.Dayjs) => {
  if (!current) return;
  const now = dayjs().add(disabledMinutes, 'm');
  const isHours = now.hour() >= current?.hour();
  return {
    disabledHours: () => {
      const arr = new Array(now.hour()).fill('').map((_, k) => k);
      return arr;
    },
    disabledMinutes: () => {
      if (isHours) {
        const arr = new Array(now.minute()).fill('').map((_, k) => k);
        return arr;
      }
    },
    disabledSeconds: () => [],
  };
};
const formList: FormItemProps[][] = [
  [
    {
      type: 'select',
      label: 'IDO type',
      name: 'crowdFundingType',
      rules: [{ required: true, message: 'Please select' }],
      childrenProps: {
        placeholder: 'Please select',
        list: [{ title: 'Sell at the set price', value: 'Sell at the set price' }],
      },
    },
    getInputOptions({
      label: 'Initial offer price',
      name: 'preSalePrice',
      extra: 'How many IDO tokens will I get for 1 {{acceptedCurrency}}.',
      rules: [{ required: true, validator: numberGtZEROValidator }],
    }),
  ],
  [
    getInputOptions({
      label: 'Supply',
      name: 'crowdFundingIssueAmount',
      rules: [{ required: true, validator: circulationValidator }],
    }),
    {
      type: 'select',
      label: 'Token unsold',
      name: 'isBurnRestToken',
      rules: [{ required: true, message: 'Please select' }],
      childrenProps: {
        placeholder: 'Please select',
        list: [
          { title: 'Burn', value: '1' },
          { title: 'Return', value: '0' },
        ],
      },
    },
  ],
  [
    getInputOptions({ label: 'Minimum allocation', name: 'minSubscription' }),
    getInputOptions({ label: 'Maximum allocation', name: 'maxSubscription' }),
  ],
  [
    {
      type: 'datePicker',
      label: 'IDO starts at',
      name: 'startTime',
      rules: [{ required: true, message: 'Please select' }],
      extra: 'The start date should be later than now.',
      childrenProps: {
        disabledDate,
        disabledTime,
        showNow: false,
      },
    },
    {
      type: 'datePicker',
      label: 'IDO ends at',
      name: 'endTime',
      rules: [{ required: true, message: 'Please select' }],
      extra: 'The end date should be later than start date.',
      childrenProps: {
        disabledDate,
        disabledTime,
        showNow: false,
      },
    },
  ],
  [
    // {
    //   type: 'select',
    //   label: 'Listed on',
    //   name: '上市于',
    //   rules: [{ required: true, message: 'Please select' }],
    //   childrenProps: {
    //     placeholder: 'Please select',
    //     list: [{ title: 'AwakenSwap', value: 'AwakenSwap' }],
    //   },
    // },
    getInputOptions({
      label: 'Listing price',
      name: 'publicSalePrice',
      extra: 'The pre-sale price must be 5% or more higher than the crowdfunding price.',
    }),
  ],
  // [
  //   {
  //     type: 'select',
  //     label: 'Fund pool',
  //     name: 'Fund pool',
  //     rules: [{ required: true, message: 'Please select' }],
  //     childrenProps: {
  //       placeholder: 'Please select',
  //       list: [
  //         { title: '0.05%', value: '0.05%' },
  //         { title: '0.3%', value: '0.3%' },
  //         { title: '0.1%', value: '0.1%' },
  //       ],
  //     },
  //   },
  // ],
  // [
  //   getInputOptions({
  //     label: 'Percentage liquidity',
  //     name: 'lockScale',
  //     rules: [{ required: true, validator: lockScaleValidator }],
  //   }),
  //   getInputOptions({
  //     label: 'Liquidity lock-up period',
  //     name: 'unlockPeriod',
  //     rules: [{ required: true, validator: lockUpTimeValidator }],
  //   }),
  // ],
  [
    {
      type: 'group',
      label: 'Enable whilelist or not',
      name: 'isEnableWhitelist',
      rules: [{ required: true, message: 'Please select' }],
      className: 'form-item-row',
      childrenProps: {
        radioList: [
          { value: true, children: 'Enable' },
          { value: false, children: 'Disable' },
        ],
      },
      extra: 'Whitelist can be set in the project panel after the project is created.',
    },
  ],
  [
    {
      className: 'form-item-row',
      type: 'customize',
      label: 'Distribution by installments',
      name: 'isInstallment',
      rules: [{ required: true, message: 'Please select' }],
    },
  ],
];
function unifyState(state: any): any {
  const obj: any = {};
  Object.keys(state || {}).map((k) => {
    const item = state[k];
    if (k.includes('Time')) {
      const diff = dayjs(item).diff(dayjs());
      if (ZERO.gt(diff)) {
        obj[k] = undefined;
      } else {
        obj[k] = dayjs(item);
      }
    } else {
      obj[k] = item;
    }
  });
  return obj;
}
const defaultPeriodExtra = 'The initial distribution is not included in the term.';
export default function ProjectPanel({ onNext, onPre }: { onNext: () => void; onPre: () => void }) {
  const [from] = Form.useForm();
  const [{ tokenSymbol, acceptedCurrency }] = useSessionStorage<ConfirmTradingPair>(storages.ConfirmTradingPair);
  const { account } = useActiveWeb3React();
  const [sessionState, setSessionState] = useSessionStorage<any>(storages.ProjectPanel);
  const initValues = unifyState(sessionState?.symbol === tokenSymbol ? sessionState : initialValues);

  const [formValue, setFormValue] = useState<any>(initValues);
  const { totalPeriod, firstDistributeProportion, restDistributeProportion } = formValue || {};
  const periodExtra = useMemo(() => {
    if (totalPeriod && firstDistributeProportion && restDistributeProportion) {
      const remaining = ZERO.plus(100).minus(firstDistributeProportion);
      const every = remaining.div(totalPeriod).dp(4, 1);
      const actual = every.times(totalPeriod);
      if (!remaining.eq(actual))
        return `The remaining ${remaining
          .minus(actual)
          .dp(4, 1)
          .toFixed()} % tokens will be burned after the distribution ends. Please try selecting a term number that is a divisor to the proportion of tokens left from the initial distribution.`;
    }
    return defaultPeriodExtra;
  }, [totalPeriod, firstDistributeProportion, restDistributeProportion]);
  const getItemProps = useCallback(
    (i: FormItemProps) => {
      let { extra, rules } = i || {};
      if (typeof extra === 'string') extra = extra.replace('{{acceptedCurrency}}', acceptedCurrency);
      // validator
      const validator = Validators[i.name as any];
      if (validator) rules = [{ required: true, validator: (_, v) => validator(from, v) }];
      if (i.type === 'customize') {
        const installmentFormList = installmentList.map((customizeList) => {
          return customizeList.map((customizeItem) => {
            let { rules, extra } = customizeItem || {};
            if (customizeItem.name === 'totalPeriod') extra = periodExtra;
            const validator = Validators[customizeItem.name as any];
            if (validator) rules = [{ required: true, validator: (_, v) => validator(from, v) }];
            return { ...customizeItem, rules, extra };
          });
        });
        i.children = (
          <Installment
            formList={installmentFormList}
            radioList={[
              { value: true, children: 'Enable' },
              { value: false, children: 'Disable' },
            ]}
          />
        );
      }
      let childrenProps = i.childrenProps;
      if (i.type === 'datePicker') {
        childrenProps = {
          ...i.childrenProps,
          showTime: { hideDisabledOptions: true, defaultValue: dayjs().add(disabledMinutes, 'm') },
        };
      }
      return { ...i, extra, rules, childrenProps };
    },
    [acceptedCurrency, from, periodExtra],
  );
  return (
    <Form
      form={from}
      {...layout}
      name="information"
      autoComplete="off"
      initialValues={initValues}
      onFinish={(v) => {
        if (!account) return;
        setSessionState({ ...v, symbol: tokenSymbol });
        onNext();
      }}
      onValuesChange={(v, allValues) => {
        setFormValue(allValues);
        const { preSalePrice } = v || {};
        let values;
        if (preSalePrice !== undefined) {
          let publicSalePrice = '';
          if (preSalePrice)
            publicSalePrice = new BigNumber(preSalePrice ?? 0)
              .div(1.05)
              .dp(PriceDecimal, BigNumber.ROUND_DOWN)
              .toFixed();
          values = { publicSalePrice };
        }
        if (values) from.setFieldsValue(values);
      }}>
      <Col span={24}>
        {formList.map((list, key) => {
          return (
            <Row key={key} justify="space-between">
              {list.map((i, k) => {
                const isRow = isRowName.includes(typeof i.name === 'string' ? i.name : '');
                return (
                  <Col key={k} span={isRow ? 24 : 11} xs={24} sm={isRow ? 24 : 11}>
                    <FormItem {...getItemProps(i)} />
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
            <Web3Button htmlType="submit" type="primary">
              Continue
            </Web3Button>
          </Col>
        </Row>
        <ToTop />
      </Col>
    </Form>
  );
}
