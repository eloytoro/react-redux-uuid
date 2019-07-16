export function incr() {
    return (dispatch) => dispatch({type: '@'});
}

// to test babel's ES modules output - this broke our _.isPlainObject check
module.exports[Symbol.toStringTag] = 'Module';
