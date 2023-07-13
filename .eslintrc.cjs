/** @type {import('eslint').ESLint.ConfigData}  */
module.exports = {
    extends: [
        '@antfu',
        '@unocss',
    ],
    rules: {
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/object-curly-spacing': ['error', 'never'],
        '@typescript-eslint/semi': ['error', 'always'],
        '@unocss/order': 'error',
        'no-multi-spaces': 'error',
        'vue/attributes-order': ['error', {alphabetical: true}],
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
            registeredComponentsOnly: false,
        }],
        'vue/first-attribute-linebreak': ['error', {
            multiline: 'below',
            singleline: 'beside',
        }],
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': ['error', {
            multiline: {max: 1},
            singleline: {max: 1},
        }],
        'vue/padding-line-between-tags': [
            'error',
            [{blankLine: 'always', next: '*', prev: '*'}],
        ],
    },
};
