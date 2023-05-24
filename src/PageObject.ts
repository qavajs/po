import {IPageObject} from './IPageObject';
import {IPageObjectStrategy} from './IPageObjectStrategy';
import {GetElementOptions} from './types';
import {DefaultPageObjectStrategy} from './DefaultStrategy';

class PageObject implements IPageObject {
    strategy: IPageObjectStrategy = new DefaultPageObjectStrategy();
    pos: { [element: string]: any } = {};
    getElement<T>(path: string, options?: GetElementOptions): Promise<T> {
        return this.strategy.getElement<T>(path, options);
    }

    init(strategy: IPageObjectStrategy): void {
        this.strategy = strategy;
        this.strategy.setPageObject(this.pos);
    }

    register(po: { [element: string]: any }): void {
        for (const prop in po) {
            this.pos[prop] = po[prop]
        }
    }
}

export default new PageObject();
