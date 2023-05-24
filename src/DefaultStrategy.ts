import {IPageObjectStrategy} from './IPageObjectStrategy';
import {GetElementOptions} from './types';

export class DefaultPageObjectStrategy implements IPageObjectStrategy{
    getElement<T>(path: string, options?: GetElementOptions): Promise<T> {
        throw new Error('Strategy is not defined')
    }

    setPageObject(pos: Object) {
        throw new Error('Strategy is not defined')
    }
}
