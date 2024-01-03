import protobuf from '@aelfqueen/protobufjs';
import AElf from 'aelf-sdk';
export function getSkipCount(maxResultCount: number, page?: number) {
  return page && page > 0 ? page * maxResultCount : 0;
}

export function getUpdateList(isUpdate: boolean, total: number, cList: any[] = []) {
  let list;
  if (isUpdate) {
    list = new Array(total);
  } else if (total === cList.length) {
    list = [...cList];
  } else {
    list = new Array(total);
    list.splice(0, cList.length, ...cList);
  }
  return list;
}

export function formatObjEmpty(obj: any) {
  Object.keys(obj).forEach((key) => {
    if (!obj[key] && typeof obj[key] !== 'number') {
      delete obj[key];
    } else {
      if (typeof obj[key] === 'object') formatObjEmpty(obj[key]);
    }
  });
  return obj;
}

export const jsonToBase64 = (json: any) => {
  try {
    return Buffer.from(JSON.stringify(json ?? {})).toString('base64');
  } catch (error) {
    return '';
  }
};

export function encodeProtoToBase64(protoJson: any, name: string, params: any) {
  const method: any = protobuf.Root.fromJSON(protoJson);
  const inputType = method[name];
  let input = AElf.utils.transform.transformMapToArray(inputType, params);
  input = AElf.utils.transform.transform(inputType, input, AElf.utils.transform.INPUT_TRANSFORMERS);
  const message = inputType.fromObject(input);
  return Buffer.from(inputType.encode(message).finish()).toString('base64');
}
