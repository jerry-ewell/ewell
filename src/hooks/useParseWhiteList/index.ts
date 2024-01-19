import { useCallback, useState } from 'react';

import { RcFile } from 'antd/es/upload';
import { parseWhiteListCSVFile, parseWhiteListExcelFile } from './utils';

export const useParseWhiteList = () => {
  const [whiteListData, setWhiteListData] = useState<string[]>([]);

  const updateFile = useCallback(async (file: RcFile): Promise<string[]> => {
    if (!file) throw new Error('file is required');

    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    try {
      let _whiteListData: string[];
      if (isExcel) {
        _whiteListData = await parseWhiteListExcelFile(file);
      } else {
        _whiteListData = await parseWhiteListCSVFile(file);
      }
      setWhiteListData(_whiteListData);
      return _whiteListData;
    } catch (error) {
      setWhiteListData([]);
      throw error;
    }
  }, []);

  return {
    whiteListData,
    setWhiteListData,
    updateFile,
  };
};
