export interface IAction {
    value: number;
    viewValue: string;
  }

export const _acctAction : IAction[]  = [
    {
        value: 1, viewValue: 'Continue operating a current account'
    },
    {
        value: 2, viewValue: 'Close existing account and open a savings account'
    }
]