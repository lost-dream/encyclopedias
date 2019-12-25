module.exports = {
    root: true,
    env: {
        node: true
    },
    rules: {
        'no-console': 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        eqeqeq: 'off',
        'no-undef': 'off'
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
}
