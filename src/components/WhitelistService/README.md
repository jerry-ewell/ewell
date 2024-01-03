# 1、 Based on antd component library development

## 2、How to use

you can see [demo](./demo/index.tsx)

## 3、 Retrieve API data Requires nginx to proxy to whitelisted servers

you can see [request](./request/README.md)

## 4、Contract

```javascript
export class AElfContractBasic {
  public contract: any;
  public address: string;
  public methods?: any;
  constructor(options: ContractProps) {
    const { aelfContract, contractAddress } = options;
    this.address = contractAddress;
    this.contract = aelfContract;
    this.getFileDescriptorsSet(this.address);
  }
  getFileDescriptorsSet = async (address: string) => {
    try {
      this.methods = await getContractMethods(address);
    } catch (error) {
      throw new Error(JSON.stringify(error) + 'getContractMethods');
    }
  };
  checkMethods = async () => {
    if (!this.methods) await this.getFileDescriptorsSet(this.address);
  };
  public callViewMethod: AElfCallViewMethod = async (functionName, paramsOption) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error1' } };
    try {
      await this.checkMethods();
      const functionNameUpper = functionName.replace(functionName[0], functionName[0].toLocaleUpperCase());
      const inputType = this.methods[functionNameUpper];
      const req = await this.contract[functionNameUpper].call(transformArrayToMap(inputType, paramsOption));
      if (!req.error && (req.result || req.result === null)) return req.result;
      return req;
    } catch (e) {
      return { error: e };
    }
  };

  public callSendMethod: AElfCallSendMethod = async (functionName, paramsOption) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error' } };
    if (!ChainConstants.aelfInstance.appName) return { error: { code: 402, message: 'connect aelf' } };
    try {
      await this.checkMethods();
      const functionNameUpper = functionName.replace(functionName[0], functionName[0].toLocaleUpperCase());
      const inputType = this.methods[functionNameUpper];
      const req = await this.contract[functionNameUpper](transformArrayToMap(inputType, paramsOption));
      if (req.error) {
        return {
          error: {
            code: req.error.message?.Code || req.error,
            message: req.errorMessage?.message || req.error.message?.Message,
          },
        };
      }
      const { TransactionId } = req.result || req;
      await sleep(1000);
      const { TransactionId: validTxId } = await getTxResult(TransactionId);
      return { TransactionId: validTxId };
    } catch (e: any) {
      if (e.message) return { error: e };
      return { error: { message: e.Error || e.Status } };
    }
  };

  public callSendPromiseMethod: AElfCallSendMethod = async (functionName, paramsOption) => {
    if (!this.contract) return { error: { code: 401, message: 'Contract init error' } };
    if (!ChainConstants.aelfInstance.appName) return { error: { code: 402, message: 'connect aelf' } };
    try {
      await this.checkMethods();
      return this.contract[functionName](transformArrayToMap(this.methods[functionName], paramsOption));
    } catch (e) {
      return { error: e };
    }
  };
}
```

## 5、 What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```text
├── index.tsx                   # whitelist common function and provider
├── demo/                       # demo
├── request/                    # API config
│   ├── list/                   # API list
├── hooks/                      # hooks folder
├── contexts/                   # contexts folder
├── utils/                      # utils folder
├── types/                      # types config
├── components/                 # common components - modal, infoTool, etc.
└── package.json
```
