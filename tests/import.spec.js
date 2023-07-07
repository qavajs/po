import {test, describe, expect} from 'vitest';
const {po, $, $$, Component} = require('../index');

describe('import', () => {
    test('po', () => {
        expect(po.init).to.be.a('function');
        expect(po.getElement).to.be.a('function');
    });

    test('$', () => {
        expect($).to.be.a('function');
    });

    test('$$', () => {
        expect($$).to.be.a('function');
    });

    test('Component', () => {
        expect(Component).to.be.a('function');
    });

});
