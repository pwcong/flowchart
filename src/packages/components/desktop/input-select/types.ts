import { ICommonProps } from '@/packages/components/types';

export enum ESelectorType {
  'dropdown' = 'dropdown',
  'modal' = 'modal',
}

export enum EHTMLType {
  'input' = 'input',
  'textarea' = 'textarea',
}

export interface ISelectorRef<T> {
  handleOk?: () => Promise<T>;
}

export type ISelectorRefObject<T> = React.RefObject<ISelectorRef<T>>;

export interface IBaseProps<T> extends ICommonProps {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  isMulti?: boolean;
  onTrigger?: () => void;
  onRenderItem?: (item: T, index: number, value: Array<T>) => React.ReactNode;
  onRenderValue?: (value: Array<T>) => React.ReactNode;
}

export enum EValueType {
  'object' = 'object',
  'string' = 'string',
  'number' = 'number',
}

export type IValue<T> = T | Array<T> | null;

export interface IValueRendererProps<T> extends IBaseProps<Array<T>> {}

export interface ISelectorProps<T> extends IBaseProps<Array<T>> {
  onOk: (value: Array<T>) => void;
  onCancel: () => void;
  defaultValue: Array<T>;
  value: Array<T>;
  wrappedComponentRef: (ref: ISelectorRefObject<Array<T>>) => void;
}

export interface IOptions<T, P> {
  valueType: EValueType;
  valueTextProperty?: string;
  valueKeyProperty?: string;
  valueRenderer?: (props: IValueRendererProps<T>) => React.ReactElement;
  selector: {
    title?: React.ReactNode;
    type: string;
    builder: (props: ISelectorProps<T> & P) => React.ReactElement;
  };
}
