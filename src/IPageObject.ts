import {IPageObjectStrategy} from './IPageObjectStrategy';
import {GetElementOptions, InitOptions} from './types';

export interface IPageObject {
    init(strategy: IPageObjectStrategy, options?: InitOptions): void;
    getElement<T>(path: string, options?: GetElementOptions): Promise<T>
    register(po: Object): void;
}
