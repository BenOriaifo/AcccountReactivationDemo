export interface IAction {
    value: string;
    viewValue: string;
  }

export const _acctAction : IAction[]  = [
    {
        value: 'view1', viewValue: 'Continue operating a current account'
    },
    {
        value: 'view2', viewValue: 'Close existing account and open a savings account'
    }
]