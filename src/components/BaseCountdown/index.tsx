import { Statistic, StatisticProps } from 'antd';
import { formatCountdown, countdownValueType, FormatConfig, Formatter } from 'antd/lib/statistic/utils';
import clsx from 'clsx';
// import moment from 'moment';
import dayjs from 'dayjs';
import * as React from 'react';
import './index.less';

const REFRESH_INTERVAL = 1000 / 30;

interface CountdownProps extends StatisticProps {
  value?: countdownValueType;
  valueClassName?: string;
  format?: string /** example DD/HH/mm/ss => 00d 00h 00m 07s */;
  onFinish?: () => void;
  onChange?: (value?: countdownValueType) => void;
  delimiter: string[] | string;
}

function getTime(value?: countdownValueType) {
  return new Date(value as any).getTime();
}

class BaseCountdown extends React.Component<CountdownProps, {}> {
  static defaultProps: Partial<CountdownProps> = {
    format: 'HH:mm:ss',
    delimiter: [' d：', ' h：', ' m：', ' s'],
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
    // if (!moment(value).isValid()) return <div>error</div>;
    if (!dayjs(value).isValid()) return <div>error</div>;
    const formatData = formatCountdown(value, { ...config, format });
    const formatDataArr = formatData.split('/');

    return (
      <div className={clsx('count-down-style', this.props.valueClassName)}>
        {formatDataArr.map((item, index) => {
          return (
            <span key={index}>
              <span key={index} className="value">
                {item}
              </span>
              {index !== formatDataArr.length - 1 && (
                <span key={`${index}deli`} className="cycle-text">
                  {typeof this.props.delimiter === 'string' ? this.props.delimiter : this.props.delimiter[index]}
                </span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  // Countdown do not need display the timestamp this.props.delimiter[index]
  // eslint-disable-next-line
  valueRender?: (node: React.ReactNode) => React.ReactNode = (node) =>
    React.cloneElement(node as React.ReactElement<HTMLDivElement>, {
      title: undefined,
    });

  render() {
    return <Statistic valueRender={this.valueRender} {...this.props} formatter={this.formatCountdown as Formatter} />;
  }
}

export default BaseCountdown;
