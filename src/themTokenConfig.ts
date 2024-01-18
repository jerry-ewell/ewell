import { IAelfdThemeProviderProps } from 'aelf-design';
import { ThemeConfig } from 'antd';

export const AELFD_THEME_CONFIG: IAelfdThemeProviderProps['theme'] = {
  token: {
    colorTextHeading: '#070A26',
    colorText: '#070A26',
    colorPrimary: '#070A26',
    colorTextDescription: '#888997',
    colorSplit: '#888997',
    controlHeight: 48,
    colorPrimaryBorder: '#070A26',
    colorBorder: '#070A26',
    colorError: '#F53F3F',
    colorErrorBorderHover: '#F53F3F',
    colorTextDisabled: '#C1C2C9',
    colorBgContainerDisabled: '#EBEBEE',
  },
  components: {
    Table: {
      headerBg: '#ffffff',
      headerSplitColor: '#ffffff',
      headerColor: '#070A26',
      borderColor: '#070A26',
    },
    Tabs: {
      horizontalItemPaddingSM: '13px 0',
      horizontalMargin: '0 0 24px 0',
      inkBarColor: '#863DFF',
      itemActiveColor: '#863DFF',
      itemHoverColor: '#863DFF',
      itemSelectedColor: '#863DFF',
    },
    Button: {
      fontWeight: 500,
      colorPrimaryHover: '#22253E',
      colorPrimaryActive: '#131631',
      primaryShadow: '',
      colorPrimary: '#070A26',
    },
  },
};

export const ANTD_THEME_CONFIG: ThemeConfig = {
  token: {
    colorPrimary: '#070A26',
    colorTextDescription: '#888997',
    colorSplit: '#888997',
    controlHeight: 48,
  },
  components: {
    Steps: {
      iconSize: 40,
      iconFontSize: 16,
      titleLineHeight: 40,
      finishIconBorderColor: '#070A26',
    },
    Form: {
      itemMarginBottom: 48,
      labelRequiredMarkColor: '#FF703D',
      labelFontSize: 16,
      verticalLabelMargin: '0 0 4px',
    },
    InputNumber: {
      activeShadow: '',
      errorActiveShadow: '',
      warningActiveShadow: '',
      addonBg: '#ffffff',
    },
  },
};

export const AELFD_CUSTOM_TOKEN_CONFIG: IAelfdThemeProviderProps['customToken'] = {
  customAddress: {
    primaryLinkColor: '#863DFF',
    primaryIconColor: '#070A26',
    addressHoverColor: '#863DFF',
    addressActiveColor: '#863DFF',
  },
};
