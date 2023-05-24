import * as WebdriverIO from 'webdriverio';
export declare type Element = WebdriverIO.Element;
export declare type ElementArray = WebdriverIO.ElementArray;
declare function $(selector: any, options?: { ignoreHierarchy: boolean }): Object;
declare function $$(selector: any, options?: { ignoreHierarchy: boolean }): Object;
declare type PageObject = {
    init(driver, options: { timeout: number }): void;
    register(pageObject: Object): void;
    getElement(path: string, options?: {immediate: boolean}): Element | ElementArray
}
declare let po: PageObject;
declare class Component {
    constructor(selector: string)
}
declare module '@qavajs/po' {
    export { $, $$, po, Component }
}
