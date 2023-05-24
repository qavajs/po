const po = require('./lib/PageObject').default;
const { $, $$ } = require('./lib/register');
const Component = require('./lib/Component').default;
const parseTokens = require('./lib/parseTokens').default;
module.exports = {
    po,
    $,
    $$,
    Component,
    parseTokens
}
