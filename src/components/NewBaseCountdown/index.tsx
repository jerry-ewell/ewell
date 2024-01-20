import { Statistic, StatisticProps } from 'antd';
import { FontWeightEnum, Typography } from 'aelf-design';
import { formatCountdown, countdownValueType, FormatConfig, Formatter } from 'antd/lib/statistic/utils';
import clsx from 'clsx';
import dayjs from 'dayjs';
import * as React from 'react';

const { Text } = Typography;

const REFRESH_INTERVAL = 1000 / 30;

interface CountdownProps extends StatisticProps {
  value?: countdownValueType;
  valueClassName?: string;
  format?: string /** example DD/HH/mm/ss => 00d 00h 00m 07s */;
  onFinish?: () => void;
  onChange?: (value?: countdownValueType) => void;
}

function getTime(value?: countdownValueType) {
  return new Date(value as any).getTime();
}

class BaseCountdown extends React.Component<CountdownProps, {}> {
  static defaultProps: Partial<CountdownProps> = {
    format: 'HH:mm:ss',
  };

  countdownId?: number;

  componentDidMount() {
    this.syncTimer();
  }

  componentDidUpdate() {
    this.syncTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  syncTimer = () => {
    const { value } = this.props;

    const timestamp = getTime(value);
    if (timestamp >= Date.now()) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  };

  startTimer = () => {
    if (this.countdownId) return;

    const { onChange, value } = this.props;
    const timestamp = getTime(value);

    this.countdownId = window.setInterval(() => {
      this.forceUpdate();

      if (onChange && timestamp > Date.now()) {
        onChange(timestamp - Date.now());
      }
    }, REFRESH_INTERVAL);
  };

  stopTimer = () => {
    const { onFinish, value } = this.props;
    if (this.countdownId) {
      clearInterval(this.countdownId);
      this.countdownId = undefined;

      const timestamp = getTime(value);
      if (onFinish && timestamp < Date.now()) {
        onFinish();
      }
    }
  };

  formatCountdown = (value: countdownValueType, config: FormatConfig) => {
    const { format } = this.props;
    if (!dayjs(value).isValid()) return <div>error</div>;
    const formatData = formatCountdown(value, { ...config, format });
    const formatDataArr = formatData.split('/');

    return (
      <div className={this.props.valueClassName}>
        {formatDataArr.map((item, index) => {
          return (
            <Text key={index} fontWeight={FontWeightEnum.Medium}>
              {item}
              {index !== formatDataArr.length - 1 && ':'}
            </Text>
          );
        })}
      </div>
    );
  };

  // TODO: adjust the height
  render() {
    return <Statistic {...this.props} formatter={this.formatCountdown as Formatter} />;
  }
}

export default BaseCountdown;
