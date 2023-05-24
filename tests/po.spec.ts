import { resolve } from 'path';
import {remote} from 'webdriverio';
import samplePO from './samplePO';
import {$, $$} from '../src/register';
import po from '../src/PageObject';
import { Element, ElementArray } from 'webdriverio';
import {test, beforeAll, afterAll, expect} from 'vitest';
import WDIOStrategy from './WDIOStrategy';

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

    const strategy = new WDIOStrategy(driver,{timeout: 5000});
    po.init(strategy);
    po.register(samplePO);
    const fileName = resolve('./tests/test_page.html');
    await driver.url('file://' + fileName);
});

test('get single element', async () => {
    const element = await po.getElement<Element>('Single Element');
    expect(await element.getText()).toEqual('text of single element');
});

test('get collection', async () => {
    const collection = await po.getElement<ElementArray>('List');
    expect(collection.length).toEqual(6);
});

test('get element from collection by index', async () => {
    const element = await po.getElement<Element>('#2 of List');
    expect(await element.getText()).toEqual('Second');
});

test('get element from collection by parial text', async () => {
    const element = await po.getElement<Element>('#Thi in List');
    expect(await element.getText()).toEqual('Third');
});

test('get element from collection by exact text', async () => {
    const element = await po.getElement<Element>('@Third in List');
    expect(await element.getText()).toEqual('Third');
});

test('get element from collection by regexp', async () => {
    const element = await po.getElement<Element>('/Thi/ in List');
    expect(await element.getText()).toEqual('Third');
});

test('get element from component', async () => {
    const element = await po.getElement<Element>('Single Component > Child Item');
    expect(await element.getText()).toEqual('text of first child item');
});

test('get element from multiple component item by index', async () => {
    const element = await po.getElement<Element>('#2 of Multiple Components > ChildItem');
    expect(await element.getText()).toEqual('second inner');
});

test('get element from multiple component item by partials text', async () => {
    const element = await po.getElement<Element>('#second in Multiple Components > Child Item');
    expect(await element.getText()).toEqual('second inner');
});

test('get element from multiple component item by exact text', async () => {
    const element = await po.getElement<Element>('@third inner in Multiple Components > Child Item');
    expect(await element.getText()).toEqual('third inner');
});

test('get child item of each element of collection', async () => {
    const collection = await po.getElement<ElementArray>('Multiple Components > Child Item');
    expect(collection.length).toEqual(3);
    expect(await collection[0].getText()).toEqual('first inner');
});

test('get element from collection by parial text containing in', async () => {
    const element = await po.getElement<Element>('#Contain in in List');
    expect(await element.getText()).toEqual('Contain in word');
});

test('get element that not exist in collection by text', async () => {
    const element = await po.getElement<Element>('#notexist in List', {immediate: true});
    expect(await element.isExisting()).toEqual(false);
    expect(await element.isDisplayed()).toEqual(false);
});

test('get element that not exist in collection by index', async () => {
    const element = await po.getElement<Element>('#42 of List', {immediate: true});
    expect(await element.isExisting()).toEqual(false);
    expect(await element.isDisplayed()).toEqual(false);
});

test('get element from async collection', async () => {
    const element = await po.getElement<Element>('Async Component > #2 of Child Items');
    expect(await element.getText()).toEqual('async 2');
});

test('get collection from collection', async () => {
    const elements = await po.getElement<ElementArray>('Level 1 Elements > Level 2 Elements > List Items');
    const text7 = await elements[6].getText();
    expect(text7).toEqual('x31');
    expect(elements.length).toEqual(9);
});

test('get collection element from collection', async () => {
    const elements = await po.getElement<ElementArray>('Level 1 Elements > Level 2 Elements > #2 of List Items');
    const text12 = await elements[0].getText();
    const text22 = await elements[1].getText();
    const text32 = await elements[2].getText();
    expect(text12).toEqual('x12');
    expect(text22).toEqual('x22');
    expect(text32).toEqual('x32');
    expect(elements.length).toEqual(3);
});

test('get element not existing in po', async () => {
    const shouldThrow = async () => await po.getElement<Element>('There Is No Element');
    await expect(shouldThrow()).rejects.toThrow(`Element 'There Is No Element' is not found in page object`);
});


test('get child from not existing element', async () => {
    const shouldThrow = async () => await po.getElement<Element>('Not Existing Component > Item');
    await expect(shouldThrow()).rejects.toThrow(`waitUntil condition failed with the following reason: Can't call $ on element with selector "not-exist" because element wasn't found`);
});

test('get collection from not existing element', async () => {
    const shouldThrow = async () => await po.getElement<Element>('Not Existing Component > Items');
    await expect(shouldThrow()).rejects.toThrow(`waitUntil condition failed with the following reason: Can't call $$ on element with selector "not-exist"`);
});

test('get collection from not existing element by index', async () => {
    const shouldThrow = async () => await po.getElement<Element>('Not Existing Component > #1 of Items');
    await expect(shouldThrow()).rejects.toThrow(`waitUntil condition failed with the following reason: Can't call $$ on element with selector "not-exist"`);
});

test('get collection from not existing element by text', async () => {
    const shouldThrow = async () => await po.getElement<Element>('Not Existing Component > #text in Items');
    await expect(shouldThrow()).rejects.toThrow(`waitUntil condition failed with the following reason: Can't call $$ on element with selector "not-exist"`);
});

test('ignore hierarchy flag', async () => {
    const element = await po.getElement<Element>('Single Component > Ignore Hierarchy Item');
    expect(await element.getText()).toEqual('first inner');
});

test('throw error if params are not passed into register function', () => {
    const shouldThrow = () => ($ as any)();
    expect(shouldThrow).toThrow('Selector or component should be passed!');
});

test('get element from component without selector', async () => {
    const element = await po.getElement<Element>('Component Without Selector > Single Element');
    const text = await element.getText();
    expect(text).toEqual('text of single element');
});

test('get element from collection from component without selector', async () => {
    const element = await po.getElement<Element>('Component Without Selector > #2 of List');
    expect(await element.getText()).toEqual('Second');
});

test('throw an error if component without selector registered as collection', async () => {
    const shouldThrow = async () => await po.getElement<Element>('#1 of Components Without Selector > #2 of List');
    await expect(shouldThrow()).rejects.toThrow(`Element 'Components Without Selector' selector property is required as it is collection`);
});

afterAll(async () => {
    await (po.strategy as any).driver.deleteSession();
})
