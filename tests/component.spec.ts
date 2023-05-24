import {test, expect} from 'vitest';
import Component from '../src/Component';
test('extend class', () => {
    class CustomComponent extends Component {}

    const customComponentInstance = new CustomComponent('.selector');
    expect(customComponentInstance.selector).toEqual('.selector');
});
