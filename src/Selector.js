function NativeSelector(selectorFunction) {

    return {
        isNativeSelector: true,
        selectorFunction
    }
}

function Selector(selectorFunction) {

    return {
        isSelectorFunction: true,
        selectorFunction
    }

}

module.exports = {
    NativeSelector,
    Selector
}
