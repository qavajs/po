const parseTokens = require('./parseTokens');
const TICK_INTERVAL = 500;
const textConditions = {
    '#': token => text => text.includes(token.value),
    '@': token => text => text === token.value,
    '/': token => text => new RegExp(token.value, 'gmi').test(text)
};

const defaultLogger = {
    log() {}
};

class PO {

    /**
     * Init page object instance
     * @public
     * @param {WebdriverIO.Browser} driver - instance of WebdriverIO browser
     * @param {{timeout?: number, logger?: Logger}} [options] - options
     */
    init(driver, options) {
        /**
         * @type { import('webdriverio').Browser }
         */
        this.driver = driver;
        this.config = {};
        this.config.timeout = options?.timeout ?? 2000;
        this.logger = options?.logger ?? defaultLogger;
        this.pageObject = {};
    }

    /**
     * Get element from page object
     * @public
     * @param {string} path - element query
     * @param {{immediate: boolean}} options - options
     * @returns { Promise<WebdriverIO.Element & WebdriverIO.ElementArray> }
     */
    async getElement(path, options = {immediate: false}) {
        if (!this.driver) throw new Error('Driver is not attached. Call po.init(driver)');
        const timeoutMsg = `Element '${path}' is not found`;
        this.checkPO(path);
        try {
            let element;
            if (options.immediate) {
                element = await this.findElement(path);
                if (!element) return this.getChildNotFound(this.driver, path);
            } else {
                element = await this.driver.waitUntil(() => this.findElement(path), {
                    timeout: this.config.timeout,
                    interval: TICK_INTERVAL,
                    timeoutMsg
                });
            }
            element.alias = path;
            return element;
        } catch (err) {
            if (err.message.includes(timeoutMsg)) {
                return this.getChildNotFound(this.driver, path);
            }
            throw err;
        }
    }

    /**
     * Resolve element by path
     * @param {string} path - element query
     * @return {Promise<Browser | Element>}
     */
    async findElement(path) {
        const tokens = parseTokens(path);
        let element = this.driver;
        let po = this.pageObject;
        while (tokens.length > 0) {
            const token = tokens.shift();
            [element, po] = await this.getEl(element, po, token);
        }
        if (element) return element;
    }

    /**
     * Register page object instance
     * @public
     * @param {Object} pageObject - page object instance
     */
    register(pageObject) {
        this.pageObject = pageObject;
    }

    /**
     * Set driver instance
     * @param {WebdriverIO.Browser} driver - instance of WebdriverIO browser
     */
    setDriver(driver) {
        this.driver = driver;
    }

    /**
     * Verify existence of PO tokens
     * @param path
     */
    checkPO(path) {
        const poTokens = parseTokens(path);
        let po = this.pageObject;
        for (const token of poTokens) {
            po = po[token.elementName.replace(/\s/g, '')];
            if (!po) throw new Error(`Element '${token.elementName}' is not found in page object`);
            if (!po.isCollection && token.suffix) throw new Error(`Element '${token.elementName}' is not collection`);
            if (po.isCollection && !po.selector && !po.isNativeSelector) throw new Error(`Element '${token.elementName}' selector property is required as it is collection`);
        }
    }

    /**
     * @private
     * @param {*} element
     * @param {*} po
     * @param {Token} token
     * @returns
     */
    async getEl(element, po, token) {
        const poAlias = token.elementName.replace(/\s/g, '');
        const newPo = po[poAlias];
        const currentElement = newPo.ignoreHierarchy ? await this.driver : await element;
        if (newPo.isNativeSelector) return [await newPo.selectorFunction(this.driver, currentElement), newPo];
        if (!newPo.selector) return [currentElement, newPo];
        newPo.resolvedSelector = this.resolveSelector(newPo.selector, token.param);
        this.logger.log(`${poAlias} -> ${newPo.resolvedSelector}`);
        if (Array.isArray(currentElement)) {
            if (!newPo.isCollection) return [
                await this.getChildrenOfCollectionElements(currentElement, newPo),
                newPo
            ];
            if (newPo.isCollection && !token.suffix) return [
                await this.getCollectionOfCollection(currentElement, newPo),
                newPo
            ];
            if (newPo.isCollection && token.suffix === 'in') return [
                await this.getElementByTextFromCollection(currentElement, newPo, token),
                newPo
            ];
            if (newPo.isCollection && token.suffix === 'of') return [
                await this.getElementByIndexFromCollection(currentElement, newPo, token),
                newPo
            ];
        } else {
            if (newPo.isCollection && token.suffix === 'in') return [
                await this.getElementByText(currentElement, newPo, token),
                newPo
            ];
            if (newPo.isCollection && token.suffix === 'of') return [
                await this.getElementByIndex(currentElement, newPo, token),
                newPo
            ];
            if (newPo.isCollection && !token.suffix) return [
                await this.getCollection(currentElement, newPo.resolvedSelector, token.param),
                newPo
            ];
            return [await this.getSingleElement(currentElement, newPo.resolvedSelector, token.param), newPo]
        }
    }

    /**
     * Get element from collection by text
     * @private
     * @param {*} element
     * @param {*} po
     * @param {*} token
     * @returns {Element}
     */
    async getElementByText(element, po, token) {
        const condition = textConditions[token.prefix](token);
        const collection = await this.getCollection(element, po.resolvedSelector);
        for (const el of collection) {
            if (condition(await el.getText())) {
                return el;
            }
        }
    }

    /**
     * Get element by text for each element in collection
     * @param collection
     * @param po
     * @param token
     * @returns {Promise<Awaited<unknown>[]>}
     */
    getElementByTextFromCollection(collection, po, token) {
        return collection.map(element => this.getElementByText(element, po, token))
    }

    getElementByIndexFromCollection(collection, po, token) {
        return collection.map(element => this.getElementByIndex(element, po, token))
    }

    /**
     * @private
     * @param {*} element
     * @param {*} po
     * @param {*} token
     * @returns
     */
    async getElementByIndex(element, po, token) {
        const index = parseInt(token.value) - 1;
        const collection = await this.getCollection(element, po.resolvedSelector);
        if (collection.length > index) {
            return collection[index]
        }
    }

    async getCollection(element, selector) {
        return element.$$(selector);
    }

    async getSingleElement(element, selector) {
        return element.$(selector);
    }

    /**
     * @private
     * @param {*} collection
     * @param {*} po
     * @returns
     */
    async getChildrenOfCollectionElements(collection, po) {
        return collection.map(async element => element.$(po.resolvedSelector))
    }

    async getCollectionOfCollection(collection, po) {
        const subCollection = await collection.map(async element => element.$$(po.resolvedSelector));
        return subCollection.reduce((flat, elements) => [...flat, ...elements], []);
    }

    async getChildNotFound(parentElement, path) {
        return parentElement.$(`ElementNotExist-${path}`.replace('>', '-').replace(/\W/g, ''))
    }

    resolveSelector(selector, param) {
        return selector.isSelectorFunction ? selector.selectorFunction(...param) : selector
    }

}

module.exports = new PO();
