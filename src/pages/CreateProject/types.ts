export interface ICreateStepPorps {
  onNext?: () => void;
  onPre?: () => void;
}

export enum ESteps {
  ONE,
  TWO,
  THREE,
  FOURE,
}
