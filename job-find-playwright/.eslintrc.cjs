const path = require('path');
const isProd = ['production', 'testing', 'staging'].includes(process.env.VITE_NODE_ENV);
const prettierRc = require('./.prettierrc');
const banConstEnum = {
	selector: 'TSEnumDeclaration[const=true]',
	message: 'Please use non-const enums. This project automatically inlines enums.',
};

module.exports = {
	root: true,
	env: {
		node: true,
		commonjs: true,
		esnext: true,
		browser: true,
	},
	// 继承的规则 [扩展]
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n/recommended',
		// 'plugin:@typescript-eslint/stylistic',
		'plugin:regexp/recommended',
		'plugin:prettier/recommended',
		'prettier', // === 'prettier/@typescript-eslint' 'prettier/standard',
		// 'plugin:jsx-control-statements/recommended',
	],
	// 解析器
	parser: '@typescript-eslint/parser',
	// 配置解析选项
	parserOptions: {
		ecmaVersion: 'latest', // | 2021  Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
	},
	// 拓展和支持相关能力的插件库
	plugins: [
		'@typescript-eslint',
		'prettier',
		// 'jsx-a11y',
		// 'jsx-control-statements',
		'i',
		'regexp',
	],
	/**
	 * "off" 或 0 - 关闭规则
	 * "warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出),
	 * "error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)
	 */
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'module',
			},
		},
	],
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-unused-vars': ['warn'], //
		'no-unused-vars': 'off',
		// [
		// 	'off',
		// 	{
		// 		argsIgnorePattern: '^_',
		// 		varsIgnorePattern: '^_',
		// 	},
		// ],
		'@typescript-eslint/ban-ts-comment': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/no-var-requires': 'off',
		// "@typescript-eslint/interface-name-prefix": "off",
		// "@typescript-eslint/explicit-member-accessibility": "off",
		// "@typescript-eslint/no-triple-slash-reference": "off",
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/no-this-alias': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		// "@typescript-eslint/triple-slash-reference": [
		//   "error",
		//   { path: "always", types: "never", lib: "never" }
		// ],

		// 优先使用 interface 而不是 type
		'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',

		// This rule enforces the preference for using '@ts-expect-error' comments in TypeScript
		// code to indicate intentional type errors, improving code clarity and maintainability.
		'@typescript-eslint/prefer-ts-expect-error': 'error',
		// Enforce the use of 'import type' for importing types
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{
				fixStyle: 'inline-type-imports',
				disallowTypeAnnotations: false,
			},
		],
		// Enforce the use of top-level import type qualifier when an import only has specifiers with inline type qualifiers
		'@typescript-eslint/no-import-type-side-effects': 'error',

		'import/no-dynamic-require': 'off',
		'import/order': 0,
		'import/imports-first': 0,
		'import/newline-after-import': 0,
		'import/no-extraneous-dependencies': 0,
		'import/no-named-as-default': 0,
		// "import/no-unresolved": [2, { caseSensitive: false }], // ts already checks case sensitive imports
		// "import/no-webpack-loader-syntax": 0,
		'import/prefer-default-export': 0,
		// "import/no-cycle": 1,
		// These rules don't add much value, are better covered by TypeScript and good definition files

		// 其他校验规则
		'jsx-control-statements/jsx-use-if-tag': 'off',
		'prettier/prettier': ['error', prettierRc],
		'no-cond-assign': 2,
		'no-console': ['error', { allow: ['warn', 'error', 'info'] }], // 'off',
		// 禁止 function 定义中出现重名参数
		'no-dupe-args': 2,
		// 禁止对象字面量中出现重复的 key
		'no-dupe-keys': 2,
		// 禁止重复的 case 标签
		'no-duplicate-case': 2,
		// 禁止空语句块
		'no-empty': 0,
		// 禁止对 catch 子句的参数重新赋值
		'no-ex-assign': 1,
		// 禁止不必要的布尔转换
		// 'no-extra-boolean-cast': 1,
		//强制使用一致的缩进 第二个参数为 "tab" 时，会使用tab，
		// 控制逗号前后的空格
		// 'comma-spacing': [
		// 	2,
		// 	{
		// 		before: false,
		// 		after: true,
		// 	},
		// ],
		// "global-require": 0,
		'no-debugger': isProd ? 'error' : 'off',
		eqeqeq: ['warn', 'always'], // 对于”==“和”===“的校验
		'prefer-const': ['error', { destructuring: 'all', ignoreReadBeforeAssign: true }],
		semi: ['error', 'always'],
		'comma-dangle': ['error', 'always-multiline'],
		'unsafe-optional-chaining': 'off',
		'no-unsafe-optional-chaining': 'off',

		'no-restricted-syntax': [
			'error',
			banConstEnum,
			// since we target ES2015 for baseline support, we need to forbid object
			// rest spread usage in destructure as it compiles into a verbose helper.
			'ObjectPattern > RestElement',
			// tsc compiles assignment spread into Object.assign() calls, but esbuild
			// still generates verbose helpers, so spread assignment is also prohiboted
			'ObjectExpression > SpreadElement',
			'AwaitExpression',
		],
		'sort-imports': ['error', { ignoreDeclarationSort: true }],
		'no-empty-function': 2,
		'no-magic-numbers': [
			2,
			{
				enforceConst: true,
				ignore: magicNumbers,
				ignoreArrayIndexes: true,
			},
		],
		'node/no-unsupported-features/es-syntax': 0,
		'node/no-unsupported-features/node-builtins': 0,
		'node/no-unpublished-import': 0,
		'node/no-unpublished-require': 0,
	},

	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
				directory: './tsconfig.json',
			},
			node: {
				extensions: ['.ts', '.tsx', '.vue', '.mjs', '.js', '.jsx', '.json', '.node', '.mdx'],
			},
			alias: [['@', './src']],
		},
		// "import/ignore": ["@types"], // Weirdly eslint cannot resolve exports in types folder (try removing this later)
	},

	reportUnusedDisableDirectives: true,
};
