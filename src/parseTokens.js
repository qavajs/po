const SPLIT_TOKENS_REGEXP = /\s*>\s*/;
const PARSE_TOKEN_REGEXP = /^(?<prefix>[#@/])(?<value>.+)\s(?<suffix>of|in)\s(?<elementName>.+)$/

class Token {
    constructor({ elementName, prefix, value, suffix }) {
        this.elementName = elementName;
        this.prefix = prefix;
        this.value = value;
        this.suffix = suffix;
        if (prefix === '/' && value[value.length - 1] === '/') {
            this.value = value.slice(0, value.length - 1);
        }
        if (elementName.includes('(')) {
            const [name, param] = elementName.replace(')', '').split(/\s+\(/);
            this.elementName = name;
            this.param = [param.replace(/([()]|^\s)/g, '')];
        }
    }

}

/**
 * Parse string to array of tokens
 * @param {string} query - query to access element
 * @return {Array<Token>}
 */
function parseTokens(query) {
    const tokens = query.split(SPLIT_TOKENS_REGEXP);
    return tokens.map(token)
}

/**
 * Check if provided query is valid
 * @param {Token} props - token props
 * @param {string} query - original query
 */
function checkQuery(props, query) {
    const header = `Query '${query}' is not well formed!\n`
    if (props.suffix === 'of' && props.prefix !== '#') {
        throw new Error(header + `'${props.prefix}' is not allowed with 'of'`);
    }
    if (props.prefix === '#' && props.suffix === 'of' && Number.isNaN(parseInt(props.value))) {
        throw new Error(header + `provided value '${props.value}' is not a number`);
    }
    if (props.prefix === '#' && props.suffix === 'of' && props.value === '0') {
        throw new Error(header + `zero index is not allowed`);
    }
    if (props.prefix === '/' && !props.value.endsWith('/')) {
        throw new Error(header + `regexp does not have closing tag /`);
    }
}

/**
 *
 * @param {string} query
 * @return {Token}
 */
function token(query) {
    if (PARSE_TOKEN_REGEXP.test(query)) {
        const props = {...PARSE_TOKEN_REGEXP.exec(query).groups};
        checkQuery(props, query);
        return new Token(props)
    }
    return new Token({
        elementName: query
    })
}

module.exports = parseTokens;
