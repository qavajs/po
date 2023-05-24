import {test, expect} from 'vitest';
import {po, $, $$, Component, parseTokens} from '../index';
test('po', () => {
    expect(po.init).to.be.a('function');
    expect(po.getElement).to.be.a('function');
    expect(po.register).to.be.a('function');
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

test('parseTokens', () => {
    expect(parseTokens).to.be.a('function');
});
