const path = require('path');
const { remote } = require('webdriverio');
const po = require('../src/PO');
const samplePO = require('./samplePO');
const { $, $$ } = require('../src/register');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

describe('po', () => {

    before(async () => {
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

    it('get single element', async () => {
        const element = await po.getElement('Single Element');
        expect(await element.getText()).to.equal('text of single element');
    });

    it('get collection', async () => {
        const collection = await po.getElement('List');
        expect(collection.length).to.equal(6);
    });

    it('get element from collection by index', async () => {
        const element = await po.getElement('#2 of List');
        expect(await element.getText()).to.equal('Second');
    });

    it('get element from collection by parial text', async () => {
        const element = await po.getElement('#Thi in List');
        expect(await element.getText()).to.equal('Third');
    });

    it('get element from collection by exact text', async () => {
        const element = await po.getElement('@Third in List');
        expect(await element.getText()).to.equal('Third');
    });

    it('get element from component', async () => {
        const element = await po.getElement('Single Component > Child Item');
        expect(await element.getText()).to.equal('text of first child item');
    });

    it('get element from multiple component item by index', async () => {
        const element = await po.getElement('#2 of Multiple Components > ChildItem');
        expect(await element.getText()).to.equal('second inner');
    });

    it('get element from multiple component item by partials text', async () => {
        const element = await po.getElement('#second in Multiple Components > Child Item');
        expect(await element.getText()).to.equal('second inner');
    });

    it('get element from multiple component item by exact text', async () => {
        const element = await po.getElement('@third inner in Multiple Components > Child Item');
        expect(await element.getText()).to.equal('third inner');
    });

    it('get child item of each element of collection', async () => {
        const collection = await po.getElement('Multiple Components > Child Item');
        expect(collection.length).to.equal(3);
        expect(await collection[0].getText()).to.equal('first inner');
    });

    it('get element from collection by parial text containing in', async () => {
        const element = await po.getElement('#Contain in in List');
        expect(await element.getText()).to.equal('Contain in word');
    });

    it('get element that not exist in collection by text', async () => {
        const element = await po.getElement('#notexist in List');
        expect(await element.isExisting()).to.equal(false);
        expect(await element.isDisplayed()).to.equal(false);
    });

    it('get element that not exist in collection by index', async () => {
        const element = await po.getElement('#42 of List');
        expect(await element.isExisting()).to.equal(false);
        expect(await element.isDisplayed()).to.equal(false);
    });

    it('get element from async collection', async () => {
        const element = await po.getElement('Async Component > #2 of Child Items');
        expect(await element.getText()).to.equal('async 2');
    });

    it('get collection from collection', async () => {
        const elements = await po.getElement('Level 1 Elements > Level 2 Elements > List Items');
        const text7 = await elements[6].getText();
        expect(text7).to.equal('x31');
        expect(elements.length).to.equal(9);
    });

    it('get collection element from collection', async () => {
        const elements = await po.getElement('Level 1 Elements > Level 2 Elements > #2 of List Items');
        const text12 = await elements[0].getText();
        const text22 = await elements[1].getText();
        const text32 = await elements[2].getText();
        expect(text12).to.equal('x12');
        expect(text22).to.equal('x22');
        expect(text32).to.equal('x32');
        expect(elements.length).to.equal(3);
    });

    it('get element not existing in po', async () => {
        const shouldThrow = async () => await po.getElement('There Is No Element');
        await expect(shouldThrow()).to.eventually.be.rejectedWith('There Is No Element is not found');
    });


    it('get child from not existing element', async () => {
        const shouldThrow = async () => await po.getElement('Not Existing Component > Item');
        await expect(shouldThrow()).to.eventually.be.rejected;
    });

    it('get collection from not existing element', async () => {
        const shouldThrow = async () => await po.getElement('Not Existing Component > Items');
        await expect(shouldThrow()).to.eventually.be.rejected;
    });

    it('get collection from not existing element by index', async () => {
        const shouldThrow = async () => await po.getElement('Not Existing Component > #1 of Items');
        await expect(shouldThrow()).to.eventually.be.rejected;
    });

    it('get collection from not existing element by text', async () => {
        const shouldThrow = async () => await po.getElement('Not Existing Component > #text in Items');
        await expect(shouldThrow()).to.eventually.be.rejected;
    });

    it('alias is added to returned element', async () => {
        const element = await po.getElement('Single Element');
        expect(element.alias).to.equal('Single Element');
    });

    it('ignore hierarchy flag', async () => {
        const element = await po.getElement('Single Component > Ignore Hierarchy Item');
        expect(await element.getText()).to.equal('first inner');
    });

    it('throw error if params are not passed into register function', () => {
        const shouldThrow = () => $();
        expect(shouldThrow).to.throw('Selector or component should be passed!');
    });

    after(async () => {
        await po.driver.deleteSession();
    })
})
