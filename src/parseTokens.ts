const SPLIT_TOKENS_REGEXP = /\s*>\s*/;
const PARSE_TOKEN_REGEXP = /^(?<prefix>[#@/])(?<value>.+)\s(?<suffix>of|in)\s(?<elementName>.+)$/

type TokenParams = {
    elementName: string,
    prefix?: string,
    value?: string,
    suffix?: string
}
class Token {
    elementName: string;
    prefix?: string;
    value?: string;
    suffix?: string;
    constructor({ elementName, prefix, value, suffix }: TokenParams) {
        this.elementName = elementName;
        this.prefix = prefix;
        this.value = value;
        this.suffix = suffix;
        if (value && prefix === '/' && value.endsWith('/')) {
            this.value = value.slice(0, value.length - 1);
        }
    }

}

/**
 * Parse string to array of tokens
 * @param {string} query - query to access element
 * @return {Array<Token>}
 */
export default function parseTokens(query: string) {
    const tokens = query.split(SPLIT_TOKENS_REGEXP);
    return tokens.map(token)
}

/**
 * Check if provided query is valid
 * @param {Token} props - token props
 * @param {string} query - original query
 */
function checkQuery(props: TokenParams, query: string) {
    const header = `Query '${query}' is not well formed!\n`
    if (props.suffix === 'of' && props.prefix !== '#') {
        throw new Error(header + `'${props.prefix}' is not allowed with 'of'`);
    }
    if (props.prefix === '#' && props.suffix === 'of' && props.value && Number.isNaN(parseInt(props.value))) {
        throw new Error(header + `provided value '${props.value}' is not a number`);
    }
    if (props.prefix === '#' && props.suffix === 'of' && props.value === '0') {
        throw new Error(header + `zero index is not allowed`);
    }
    if (props.prefix === '/' && props.value && !props.value.endsWith('/')) {
        throw new Error(header + `regexp does not have closing tag /`);
    }
}

/**
 *
 * @param {string} query
 * @return {Token}
 */
function token(query: string) {
    if (PARSE_TOKEN_REGEXP.test(query)) {
        const props = {...(PARSE_TOKEN_REGEXP.exec(query) as any).groups};
        checkQuery(props, query);
        return new Token(props)
    }
    return new Token({
        elementName: query
    })
}
