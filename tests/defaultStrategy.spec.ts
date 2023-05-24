import {test, expect} from 'vitest';
import {DefaultPageObjectStrategy} from '../src/DefaultStrategy';
const strategy = new DefaultPageObjectStrategy();
test('setPageObject throws an error', () => {
    const handler = () => strategy.setPageObject({});
    expect(handler).toThrow('Strategy is not defined');
});

test('getElement throws an error', () => {
    const handler = () => strategy.getElement('query');
    expect(handler).toThrow('Strategy is not defined');
});
