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
    }
}

/**
 * Parse string to array of tokens
 * @param {string} path
 * @return {Array<Token>}
 */
function parseTokens(path) {
    const tokens = path.split(SPLIT_TOKENS_REGEXP);
    return tokens.map(token)
}

/**
 *
 * @param {string} value
 * @return {Token}
 */
function token(value) {
    if (PARSE_TOKEN_REGEXP.test(value)) {
        return new Token({...PARSE_TOKEN_REGEXP.exec(value).groups})
    }
    return new Token({
        elementName: value
    })
}

module.exports = parseTokens;
