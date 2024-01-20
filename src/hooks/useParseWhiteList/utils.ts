import { isAelfAddress } from 'aelf-web-login';
import { DEFAULT_CHAIN_ID } from 'constants/network';
import * as ExcelJS from 'exceljs';
import { getAddressInfo } from 'utils/aelf';
import Papa from 'papaparse';

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
export enum WhiteListAddressIdentifyStatusEnum {
  active = 1,
  exist,
  matchFail,
  repeat,
  notExist,
}
export type TWhiteListIdentifyItem = {
  address: string;
  status: WhiteListAddressIdentifyStatusEnum;
};
export enum IdentifyWhiteListDataTypeEnum {
  add = 1,
  remove,
}
export type TIdentifyWhiteListDataParams = {
  originData: TWhiteListData;
  identifyData: TWhiteListData;
  type: IdentifyWhiteListDataTypeEnum;
};

export const identifyWhiteListData = ({ originData, identifyData, type }: TIdentifyWhiteListDataParams) => {
  const originDataMap: Record<string, boolean> = {};
  originData.forEach((address) => {
    originDataMap[address] = true;
  });

  const identifyDataMap: Record<string, boolean> = {};
  const identifyList: TWhiteListIdentifyItem[] = [];
  identifyData.forEach((address) => {
    if (type === IdentifyWhiteListDataTypeEnum.add) {
      if (originDataMap[address]) {
        identifyList.push({
          address: address,
          status: WhiteListAddressIdentifyStatusEnum.exist,
        });
        return;
      }
    } else {
      if (!originDataMap[address]) {
        identifyList.push({
          address: address,
          status: WhiteListAddressIdentifyStatusEnum.notExist,
        });
        return;
      }
    }

    if (identifyDataMap[address]) {
      return identifyList.push({
        address: address,
        status: WhiteListAddressIdentifyStatusEnum.repeat,
      });
    }
    identifyDataMap[address] = true;

    const addressInfo = getAddressInfo(address);
    if (
      addressInfo.prefix !== 'ELF' ||
      addressInfo.suffix !== DEFAULT_CHAIN_ID ||
      !isAelfAddress(addressInfo.address)
    ) {
      identifyList.push({
        address: address,
        status: WhiteListAddressIdentifyStatusEnum.matchFail,
      });
      return;
    }

    identifyList.push({
      address: address,
      status: WhiteListAddressIdentifyStatusEnum.active,
    });
  });

  return identifyList;
};
