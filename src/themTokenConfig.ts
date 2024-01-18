import { IAelfdThemeProviderProps } from 'aelf-design';
import { IAelfdCustomToken } from 'aelf-design/dist/es/provider';
import { ThemeConfig } from 'antd';

export const AELFD_THEME_CONFIG: IAelfdThemeProviderProps['theme'] = {
  token: {
    colorPrimary: '#070A26',
    colorTextDescription: '#888997',
    colorSplit: '#888997',
    controlHeight: 48,
    colorPrimaryHover: '#9B5EFF',
    colorPrimaryActive: '#863DFF',
    colorBorder: '#070A26',
  },
  components: {
    Steps: {
      iconSize: 40,
      iconFontSize: 16,
      titleLineHeight: 40,
      finishIconBorderColor: '#070A26',
    },
    // Form: {
    //   itemMarginBottom: 48,
    //   labelRequiredMarkColor: '#FF703D',
    //   labelFontSize: 16,
    //   verticalLabelMargin: '0 0 4px',
    // },
    // InputNumber: {
    //   activeBorderColor: '#863DFF',
    // },
    // Form: {
    //   itemMarginBottom: 48,
    //   labelRequiredMarkColor: '#FF703D',
    //   labelFontSize: 16,
    //   verticalLabelMargin: '0 0 4px',
    // },
    Input: {
      activeBorderColor: '#863DFF',
    },
  },
};

export const ANTD_THEME_CONFIG: ThemeConfig = {
  token: {
    colorPrimary: '#070A26',
    colorTextDescription: '#888997',
    colorSplit: '#888997',
    controlHeight: 48,
    colorPrimaryHover: '#9B5EFF',
    colorPrimaryActive: '#863DFF',
    colorBorder: '#070A26',
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
      activeBorderColor: '#863DFF',
    },
  },
};

export const AELFD_CUSTOM_TOKEN_CONFIG: IAelfdCustomToken = {
  customAddress: {
    primaryLinkColor: '#863DFF',
    primaryIconColor: '#070A26',
    addressHoverColor: '#070A26',
    addressActiveColor: '#863DFF',
  },
};
