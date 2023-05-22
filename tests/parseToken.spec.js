import {test, beforeAll, afterAll, expect} from 'vitest';
const parseToken = require('../src/parseTokens');
    [
        {
            query: 'Element',
            tokens: [{
                elementName: 'Element',
                prefix: undefined,
                suffix: undefined,
                value: undefined
            }]
        },
        {
            query: 'Component > Element',
            tokens: [{
                elementName: 'Component',
                prefix: undefined,
                suffix: undefined,
                value: undefined
            }, {
                elementName: 'Element',
                prefix: undefined,
                suffix: undefined,
                value: undefined
            }]
        },
        {
            query: '#1 of Collection',
            tokens: [{
                elementName: 'Collection',
                prefix: '#',
                suffix: 'of',
                value: '1'
            }]
        },
        {
            query: '#text in Collection',
            tokens: [{
                elementName: 'Collection',
                prefix: '#',
                suffix: 'in',
                value: 'text'
            }]
        },
        {
            query: '#text three words in Collection',
            tokens: [{
                elementName: 'Collection',
                prefix: '#',
                suffix: 'in',
                value: 'text three words'
            }]
        },
        {
            query: '@text three words in Collection',
            tokens: [{
                elementName: 'Collection',
                prefix: '@',
                suffix: 'in',
                value: 'text three words'
            }]
        },
        {
            query: '/^text$/ in Collection',
            tokens: [{
                elementName: 'Collection',
                prefix: '/',
                suffix: 'in',
                value: '^text$'
            }]
        },
    ].forEach(data => {
        test(data.query, () => {
            expect(parseToken(data.query)).to.eql(data.tokens)
        });
    });

    [
        {
            query: '#text of Element',
            error: `Query '#text of Element' is not well formed!\nprovided value 'text' is not a number`
        },
        {
            query: '#0 of Element',
            error: `Query '#0 of Element' is not well formed!\nzero index is not allowed`
        },
        {
            query: '/regexp in Element',
            error: `Query '/regexp in Element' is not well formed!\nregexp does not have closing tag /`
        },
        {
            query: '@1 of Element',
            error: `Query '@1 of Element' is not well formed!\n'@' is not allowed with 'of'`
        },
        {
            query: '/1 of Element',
            error: `Query '/1 of Element' is not well formed!\n'/' is not allowed with 'of'`
        }
    ].forEach(data => {
        test(`error ${data.query}`, () => {
            const handler = () => parseToken(data.query);
            expect(handler).to.throw(data.error)
        });
    });
