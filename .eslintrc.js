module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ['plugin:vue/essential', '@vue/prettier'],
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
