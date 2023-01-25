const { expect } = require('chai');
const { po, $, $$, Component } = require('../index');
describe('Component', () => {
    it('po', () => {
        expect(po.init).to.be.a('function');
        expect(po.getElement).to.be.a('function');
    });

    it('$', () => {
        expect($).to.be.a('function');
    });

    it('$$', () => {
        expect($$).to.be.a('function');
    });

    it('Component', () => {
        expect(Component).to.be.a('function');
    });
});
