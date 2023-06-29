/**
 * register element in page object
 * @param {string|object} definition
 * @param {boolean} isCollection
 * @param {{ ignoreHierarchy }} options - page object definition options
 * @returns {{ definition, isCollection, ignoreHierarchy }}
 */
function register(definition, isCollection, options = { ignoreHierarchy: false }) {
    if (!definition) throw new Error('Selector or component should be passed!');
    if (typeof definition === 'object' && !definition.isSelectorFunction) {
        return {
            ...definition,
            isCollection,
            ...options
        }
    }
    return {
        selector: definition,
        isCollection,
        ...options
    }
}

function $(definition, options) {
    return register(definition, false, options)
}

function $$(definition, options) {
    return register(definition, true, options)
}

module.exports = {
    $,
    $$,
    register
};
