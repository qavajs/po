import {GetElementOptions} from './types';

export interface IPageObjectStrategy {
    getElement<T>(path: string, options?: GetElementOptions): Promise<T>;
    setPageObject(pos: Object): void;
}
