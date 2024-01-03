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
