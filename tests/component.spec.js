const { expect } = require('chai');
const Component = require('../src/Component');
describe('Component', () => {
    it('extend class', () => {
        class CustomComponent extends Component {}
        const customComponentInstance = new CustomComponent('.selector');
        expect(customComponentInstance.selector).to.equal('.selector');
    });
});
