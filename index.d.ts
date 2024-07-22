declare type SelectorOptions = {
    ignoreHierarchy?: boolean
}
declare interface Logger {
    log(value: any): void;
}
declare type PageObject = {
    /**
     * Init page object instance
     * @param {WebdriverIO.Browser} driver
     * @param {{timeout?: number, logger?: Logger}} options - additional options
     * @example
     * po.init(driver, {timeout: 5000, logger: new Logger()});
     */
    init(driver: WebdriverIO.Browser, options?: { timeout?: number, logger?: Logger }): void;
    /**
     * Register page object tree
     * @param pageObject
     * @example
     * po.register(new PageObject());
     */
    register(pageObject: Object): void;
    /**
     * Get element
     * @param {string} path - page object select
     * @param {{ immediate?: boolean }} options - additional options
     * @example
     * const element = await po.getElement('Element');
     * const collection = await po.getElement('Component > Collection');
     */
    getElement(path: string, options?: { immediate?: boolean }): WebdriverIO.Element | WebdriverIO.ElementArray;
    /**
     * Set new driver instance
     * @param {WebdriverIO.Browser} driver
     * @example
     * po.setDriver(driver);
     */
    setDriver(driver: WebdriverIO.Browser): void;
    /**
     * driver instance
     */
    driver: WebdriverIO.Browser;
}

/**
 * Component class
 * @example
 * class Panel extends Component {
 *     Element = $('#element');
 * }
 * class App {
 *     Panel = $(new Panel('#panel'));
 * }
 */
export declare class Component {
    constructor(selector: any)
}

/**
 * Function to define dynamic selector
 * @param {selectorFunction: (arg: string) => string | Object} selectorFunction
 * @example
 * class App {
 *     DynamicElement = $(Selector(index => `.element:nth(${index})`));
 * }
 *
 * When I click 'Dynamic Element (3)'
 */
export declare function Selector(selectorFunction: (arg: string) => Object): any;

/**
 * Function to obtain element in framework native way
 * @param {selectorFunction: (browser: WebdriverIO.Browser, parent: WebdriverIO.Element) => WebdriverIO.Element} selectorFunction
 * @example
 * class App {
 *     NativeElement = $(NativeSelector(browser => browser.$('#selector'));
 * }
 *
 * When I click 'NativeElement'
 */
export declare function NativeSelector(selectorFunction: (browser: WebdriverIO.Browser, parent: WebdriverIO.Element) => WebdriverIO.Element): any;

/**
 * Define element or component
 * @param {string | Object} selector - selector
 * @param {SelectorOptions} options - additional options
 * @example
 * class App {
 *     Element = $('#element');
 *     Panel = $(new Panel('#panel'));
 *     ElementWithIgnoreHierarchy = $('#ingnoreHierarchy', { ignoreHierarchy: true });
 * }
 */
export declare function $(
    selector: string | Object,
    options?: SelectorOptions
): any;

/**
 * Define collection
 * @param {string | Object} selector - selector
 * @param {SelectorOptions} options - additional options
 * @example
 * class App {
 *     Collection = $$('#element');
 *     Panels = $$(new Panel('#panel'));
 *     CollectionWithIgnoreHierarchy = $$('#ingnoreHierarchy', { ignoreHierarchy: true });
 * }
 */
export declare function $$(
    selector: string | Object,
    options?: SelectorOptions
): Object;

/**
 * Page object instance
 * @type { PageObject }
 */
export declare let po: PageObject;