/**
 * register element in page object
 * @param {string|object} definition
 * @param {boolean} isCollection
 * @param {{ ignoreHierarchy }} options - page object definition options
 * @returns {{ definition, isCollection, ignoreHierarchy }}
 */
export function register(definition: any, isCollection: boolean, options = { ignoreHierarchy: false }) {
    if (!definition) throw new Error('Selector or component should be passed!');
    if (typeof definition === 'object') {
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

export function $(definition: any, options?: { ignoreHierarchy: boolean }) {
    return register(definition, false, options)
}

export function $$(definition: any, options?: { ignoreHierarchy: boolean }) {
    return register(definition, true, options)
}
