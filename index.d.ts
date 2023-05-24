import { Token } from './src/parseTokens';
declare function $(selector: any, options?: { ignoreHierarchy: boolean }): Object;
declare function $$(selector: any, options?: { ignoreHierarchy: boolean }): Object;
declare function parseTokens(query: string): Token[]
declare type PageObject = {
    init(driver, options: { timeout: number }): void;
    register(pageObject: Object): void;
    getElement<T>(path: string, options?: {immediate: boolean}): T
}
declare let po: PageObject;
declare class Component {
    constructor(selector: string)
}
declare module '@qavajs/po' {
    export { $, $$, po, Component, parseTokens }
}
