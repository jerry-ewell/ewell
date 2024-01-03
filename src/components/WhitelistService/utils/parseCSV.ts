import Papa, { ParseConfig } from 'papaparse';

interface ParseCSVProps extends ParseConfig {
  file?: any;
  worker?: boolean | undefined;
  chunkSize?: number | undefined;
  encoding?: string | undefined;
}

export const parseCSV = ({ file, ...props }: ParseCSVProps) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject('no file');
    Papa.parse(file as any, {
      skipEmptyLines: true,
      error(err) {
        // type: "",     // A generalization of the error
        // code: "",     // Standardized error code
        // message: "",  // Human-readable details
        // row: 0,       // Row index of parsed data where error is
        // message.error(`Parsing error:${err?.message ?? 'error'}`);
        reject(`Parsing error:${err?.message}`);
      },
      ...props,
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
          // setUpVal(list);
          // triggerChange?.({ v: list });
        } catch (e) {
          reject(`${e}`);
        }
      },
      // TODO when big file can use
      // step(results, parser) {
      //   console.log(results, parser, 'Papa==step');
      //   console.log('Row data:', results.data);
      //   console.log('Row errors:', results.errors);
      // },
    });
  });
};
