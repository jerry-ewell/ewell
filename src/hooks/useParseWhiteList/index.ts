import { useCallback, useState } from 'react';

import { RcFile } from 'antd/es/upload';
import { parseWhitelistCSVFile, parseWhitelistExcelFile } from 'utils/parseWhiteList';

export const useParseWhitelist = () => {
  const [whitelistData, setWhitelistData] = useState<string[]>([]);

  const updateFile = useCallback(async (file: RcFile): Promise<string[]> => {
    if (!file) throw new Error('file is required');

    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    try {
      let _whitelistData: string[];
      if (isExcel) {
        _whitelistData = await parseWhitelistExcelFile(file);
      } else {
        _whitelistData = await parseWhitelistCSVFile(file);
      }
      setWhitelistData(_whitelistData);
      return _whitelistData;
    } catch (error) {
      setWhitelistData([]);
      throw error;
    }
  }, []);

  return {
    whitelistData,
    setWhitelistData,
    updateFile,
  };
};
