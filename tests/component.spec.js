import {test, describe, expect} from 'vitest';
const Component = require('../src/Component');
describe('component', () => {
    test('extend class', () => {
        class CustomComponent extends Component {
        }

        const customComponentInstance = new CustomComponent('.selector');
        expect(customComponentInstance.selector).toEqual('.selector');
    });
});

