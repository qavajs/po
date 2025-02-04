import {afterAll, beforeAll, describe, expect, test, beforeEach} from 'vitest';
import {remote} from 'webdriverio';
import poLogger from '../src/PO';
import samplePO from './samplePO';
import path from 'path';

describe('logger', () => {
	const logger = {
		logs: [],
		log(value) {
			this.logs.push(value);
		},
		clean() {
			this.logs = [];
		}
	};

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
		logger.clean();
		poLogger.init(driver, {timeout: 5000, logger});
		poLogger.register(samplePO);
		const fileName = path.resolve('./tests/test_page.html');
		await driver.url('file://' + fileName);
	});

	beforeEach(() => {
		logger.clean();
	});

	test('get single element', async () => {
		const element = await poLogger.getElement('Single Element');
		expect(logger.logs).toEqual(['SingleElement -> .single-element']);
	});

	test('get child element', async () => {
		const element = await poLogger.getElement('Single Component > Child Item');
		expect(logger.logs).toEqual(['SingleComponent -> .container', 'ChildItem -> .child-item']);
	});

	test('get Selector element', async () => {
		const element = await poLogger.getElement('Async Component By Selector (#async-list-components)');
		expect(logger.logs).toEqual(['AsyncComponentBySelector -> #async-list-components']);
	});

	afterAll(async () => {
		await poLogger.driver.deleteSession();
	});

});

