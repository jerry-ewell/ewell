import { isAelfAddress } from 'aelf-web-login';
import { DEFAULT_CHAIN_ID } from 'constants/network';
import * as ExcelJS from 'exceljs';
import { getAddressInfo } from 'utils/aelf';
import Papa, { ParseConfig } from 'papaparse';

export const parseWhiteListExcelFile = async (file: any) => {
  const addressList: string[] = [];
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(file);
  workbook.worksheets.forEach((worksheet) => {
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        addressList.push(cell.value as string);
      });
    });
  });
  return addressList;
};

interface ParseCSVProps extends ParseConfig {
  file?: any;
  worker?: boolean | undefined;
  chunkSize?: number | undefined;
  encoding?: string | undefined;
}

export const parseWhiteListCSVFile = (file: any): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      error(err) {
        reject(`Parsing error:${err?.message}`);
      },
      complete(result) {
        try {
          const list: string[] = [];
          const { data } = result;
          data?.map((line) => {
            if (line instanceof Array) {
              line.map((row) => {
                if (row) {
                  list.push(row);
                }
              });
            }
          });
          resolve(list);
          return list;
        } catch (e) {
          reject(`${e}`);
        }
      },
    });
  });
};

export type TWhiteListData = string[];
export enum WhiteListAddressFilterStatusEnum {
  active = 1,
  exist,
  matchFail,
  repeat,
}
export type TFilterItem = {
  address: string;
  status: WhiteListAddressFilterStatusEnum;
};

export const filterWhiteListData = (originData: TWhiteListData, filterData: TWhiteListData) => {
  const originDataMap: Record<string, boolean> = {};
  originData.forEach((address) => {
    originDataMap[address] = true;
  });

  const filterDataMap: Record<string, boolean> = {};
  const filterList: TFilterItem[] = [];
  filterData.forEach((address, idx) => {
    if (originDataMap[address]) {
      filterList.push({
        address: address,
        status: WhiteListAddressFilterStatusEnum.exist,
      });
      return;
    }

    if (filterDataMap[address]) {
      return filterList.push({
        address: address,
        status: WhiteListAddressFilterStatusEnum.repeat,
      });
    }
    filterDataMap[address] = true;

    const addressInfo = getAddressInfo(address);
    if (
      addressInfo.prefix !== 'ELF' ||
      addressInfo.suffix !== DEFAULT_CHAIN_ID ||
      !isAelfAddress(addressInfo.address)
    ) {
      filterList.push({
        address: address,
        status: WhiteListAddressFilterStatusEnum.matchFail,
      });
      return;
    }

    filterList.push({
      address: address,
      status: WhiteListAddressFilterStatusEnum.active,
    });
  });

  return filterList;
};
