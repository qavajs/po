const path = require('path');
const {remote} = require('webdriverio');
const po = require('../src/PO');
const samplePO = require('./samplePO');
const {$, $$} = require('../src/register');
import {test, beforeAll, afterAll, describe, expect} from 'vitest';

describe('page object', () => {
    beforeAll(async () => {
        const driver = await remote({
            logLevel: 'warn',
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    args: ['--headless']
                }
            }
        });

        po.init(driver, {timeout: 5000});
        po.register(samplePO);
        const fileName = path.resolve('./tests/test_page.html');
        await driver.url('file://' + fileName);
    });

    test('get single element', async () => {
        const element = await po.getElement('Single Element');
        expect(await element.getText()).toEqual('text of single element');
    });

    test('get collection', async () => {
        const collection = await po.getElement('List');
        expect(collection.length).toEqual(6);
    });

    test('get element from collection by index', async () => {
        const element = await po.getElement('#2 of List');
        expect(await element.getText()).toEqual('Second');
    });

    test('get element from collection by parial text', async () => {
        const element = await po.getElement('#Thi in List');
        expect(await element.getText()).toEqual('Third');
    });

    test('get element from collection by exact text', async () => {
        const element = await po.getElement('@Third in List');
        expect(await element.getText()).toEqual('Third');
    });

    test('get element from collection by regexp', async () => {
        const element = await po.getElement('/Thi/ in List');
        expect(await element.getText()).toEqual('Third');
    });

    test('get element from component', async () => {
        const element = await po.getElement('Single Component > Child Item');
        expect(await element.getText()).toEqual('text of first child item');
    });

    test('get element from multiple component item by index', async () => {
        const element = await po.getElement('#2 of Multiple Components > ChildItem');
        expect(await element.getText()).toEqual('second inner');
    });

    test('get element from multiple component item by partials text', async () => {
        const element = await po.getElement('#second in Multiple Components > Child Item');
        expect(await element.getText()).toEqual('second inner');
    });

    test('get element from multiple component item by exact text', async () => {
        const element = await po.getElement('@third inner in Multiple Components > Child Item');
        expect(await element.getText()).toEqual('third inner');
    });

    test('get child item of each element of collection', async () => {
        const collection = await po.getElement('Multiple Components > Child Item');
        expect(collection.length).toEqual(3);
        expect(await collection[0].getText()).toEqual('first inner');
    });

    test('get element from collection by parial text containing in', async () => {
        const element = await po.getElement('#Contain in in List');
        expect(await element.getText()).toEqual('Contain in word');
    });

    test('get element that not exist in collection by text', async () => {
        const element = await po.getElement('#notexist in List', {immediate: true});
        expect(await element.isExisting()).toEqual(false);
        expect(await element.isDisplayed()).toEqual(false);
    });

    test('get element that not exist in collection by index', async () => {
        const element = await po.getElement('#42 of List', {immediate: true});
        expect(await element.isExisting()).toEqual(false);
        expect(await element.isDisplayed()).toEqual(false);
    });

    test('get element from async collection', async () => {
        const element = await po.getElement('Async Component > #2 of Child Items');
        expect(await element.getText()).toEqual('async 2');
    });

    test('get collection from collection', async () => {
        const elements = await po.getElement('Level 1 Elements > Level 2 Elements > List Items');
        const text7 = await elements[6].getText();
        expect(text7).toEqual('x31');
        expect(elements.length).toEqual(9);
    });

    test('get collection element from collection', async () => {
        const elements = await po.getElement('Level 1 Elements > Level 2 Elements > #2 of List Items');
        const text12 = await elements[0].getText();
        const text22 = await elements[1].getText();
        const text32 = await elements[2].getText();
        expect(text12).toEqual('x12');
        expect(text22).toEqual('x22');
        expect(text32).toEqual('x32');
        expect(elements.length).toEqual(3);
    });

    test('get element not existing in po', async () => {
        const shouldThrow = async () => await po.getElement('There Is No Element');
        await expect(shouldThrow()).rejects.toThrow(`Element 'There Is No Element' is not found in page object`);
    });


    test('get child from not existing element', async () => {
        const shouldThrow = async () => await po.getElement('Not Existing Component > Item');
        await expect(shouldThrow()).rejects.toThrow(`waitUntil condition failed with the following reason: Can't call $ on element with selector "not-exist" because element wasn't found`);
    });

    test('get collection from not existing element', async () => {
        const shouldThrow = async () => await po.getElement('Not Existing Component > Items');
        await expect(shouldThrow()).rejects.toThrow(`waitUntil condition failed with the following reason: Can't call $$ on element with selector "not-exist"`);
    });

    test('get collection from not existing element by index', async () => {
        const shouldThrow = async () => await po.getElement('Not Existing Component > #1 of Items');
        await expect(shouldThrow()).rejects.toThrow(`waitUntil condition failed with the following reason: Can't call $$ on element with selector "not-exist"`);
    });

    test('get collection from not existing element by text', async () => {
        const shouldThrow = async () => await po.getElement('Not Existing Component > #text in Items');
        await expect(shouldThrow()).rejects.toThrow(`waitUntil condition failed with the following reason: Can't call $$ on element with selector "not-exist"`);
    });

    test('alias is added to returned element', async () => {
        const element = await po.getElement('Single Element');
        expect(element.alias).toEqual('Single Element');
    });

    test('ignore hierarchy flag', async () => {
        const element = await po.getElement('Single Component > Ignore Hierarchy Item');
        expect(await element.getText()).toEqual('first inner');
    });

    test('throw error if params are not passed into register function', () => {
        const shouldThrow = () => $();
        expect(shouldThrow).toThrow('Selector or component should be passed!');
    });

    test('get element from component without selector', async () => {
        const element = await po.getElement('Component Without Selector > Single Element');
        const text = await element.getText();
        expect(text).toEqual('text of single element');
    });

    test('get element from collection from component without selector', async () => {
        const element = await po.getElement('Component Without Selector > #2 of List');
        expect(await element.getText()).toEqual('Second');
    });

    test('throw an error if component without selector registered as collection', async () => {
        const shouldThrow = async () => await po.getElement('#1 of Components Without Selector > #2 of List');
        await expect(shouldThrow()).rejects.toThrow(`Element 'Components Without Selector' selector property is required as it is collection`);
    });

    test('get element by parametrised selector', async () => {
        const element = await po.getElement('Async Component > Child Item By Index (2)');
        expect(await element.getText()).toEqual('async 2');
    });

    test('get component by parametrised selector', async () => {
        const element = await po.getElement('Async Component By Selector (#async-list-components) > #2 of Child Items');
        expect(await element.getText()).toEqual('async 2');
    });

    test('get collection by parametrised selector', async () => {
        const element = await po.getElement('Parametrized List (odd)');
        expect(element.length).toEqual(3);
    });

    test('get native single element', async () => {
        const element = await po.getElement('Native Selector Single Element');
        expect(await element.getText()).toBe('text of single element');
    });

    test('get native single element from parent', async () => {
        const element = await po.getElement('Native Selector Single Element From Parent');
        expect(await element.getText()).toBe('text of single element');
    });

    test('get native collection', async () => {
        const collection = await po.getElement('Native Selector List');
        expect(collection.length).toBe(6);
    });

    afterAll(async () => {
        await po.driver.deleteSession();
    });
});
