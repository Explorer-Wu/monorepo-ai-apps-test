import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

// NODE_ENV 的值决定了加载哪个环境的文件
const modeExt = process.env.NODE_ENV || 'development';

// 先加载入仓的配置文件，再加载本地的配置文件
dotenv.config({ path: './env/.env' });
dotenv.config({ path: `./env/.env.${modeExt}`, override: true });
// dotenv.config({ path: './env/.env.local', override: true });
// dotenv.config({ path: `./env/.env.${modeExt}.local`, override: true });

export const USER_STATE_PATH = path.join(__dirname, './.auth/user-state.json');

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	// 测试目录
	testDir: './tests',
	// 是否并发运行测试
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* 测试失败用例重试次数 Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	// 测试时使用的进程数，进程数越多可以同时执行的测试任务就越多。不设置则尽可能多地开启进程。
	workers: process.env.CI ? 10 : undefined,
	// 指定测试产物(追踪信息、视频、截图)输出路径
	outputDir: 'test-results',
	/* 指定测试结果如何输出 Reporter to use. See https://playwright.dev/docs/test-reporters */
	// reporter: 'html',
	reporter: [
		// 在命令行中同步打印每条用例的执行结果
		['list'],
		// 输出 html 格式的报告，并将报告归档与指定路径
		[
			'html',
			{
				outputFolder: 'playwright-report',
			},
		],
	],
	globalTimeout: 10 * 60 * 1000,
	// globalSetup: require.resolve('./tests/global-setup'), 相当于使用test.beforeAll

	/** 测试 project 的公共配置，会与与下面 projects 字段中的每个对象的 use 对象合并。
	 *  Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
	 **/
	use: {
		/* 测试时各种请求的基础路径 Base URL to use in actions like `await page.goto('/')`. */
		// 非 CI 环境下，第一次失败重试时生成追踪信息。非 CI 环境下，总是生成追踪信息
		baseURL: process.env.WEBSITE_URL, // 'http://127.0.0.1:3006',

		/** 生成测试追踪信息的规则，on-first-retry 意为第一次重试时生成。
		 * Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
		 **/
		trace: 'on-first-retry',
		// storageState: '.auth/user-state.json',  当使用globalSetup配置属性时设置
		actionTimeout: 30 * 1000,
		navigationTimeout: 20 * 1000,
	},

	/* 定义每个 project，示例中将不同的浏览器测试区分成了不同的项目 Configure projects for major browsers */
	projects: [
		// 项目依赖的方式， 工程只执行 tests 目录下以 .setup.ts 结尾的文件。在所有正式测试执行前先完成鉴权初始化
		{
			name: 'setup db',
			testMatch: /global\.setup\.ts/,
			// teardown: 'cleanup db',
		},
		// {
		// 	name: 'cleanup db',
		// 	testMatch: /global\.teardown\.ts/,
		// },
		{
			name: 'chromium',
			testMatch: 'tests/*.loggedin.spec.ts',
			// testMatch: /tests\/*\.loggedin\.spec\.ts/,
			//  use: { ...devices['Desktop Chrome'] },
			use: {
				...devices['Desktop Chrome'],
				// setup 完成鉴权后，浏览器缓存状态会保存在此，正式的测试工程在执行前通过此文件恢复浏览器缓存，进而获取了用户登录态
				storageState: USER_STATE_PATH,
			},
			// 必须在 setup 完成鉴权后执行
			// dependencies: ['setup db'],
		},
		{
			name: 'firefox',
			testMatch: /tests\/*\.loggedin\.spec\.ts/,
			//  use: { ...devices['Desktop Firefox'] },
			use: {
				...devices['Desktop Firefox'],
				storageState: USER_STATE_PATH,
			},
			dependencies: ['setup db'],
		},
		{
			name: 'webkit',
			testMatch: /tests\/*\.loggedin\.spec\.ts/,
			// use: { ...devices['Desktop Safari'] },
			use: {
				...devices['Desktop Safari'],
				storageState: USER_STATE_PATH,
			},
			dependencies: ['setup db'],
		},

		/* Test against mobile viewports. */
		// {
		//   name: 'Mobile Chrome',
		//   use: { ...devices['Pixel 5'] },
		// },
		// {
		//   name: 'Mobile Safari',
		//   use: { ...devices['iPhone 12'] },
		// },

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	// webServer: {
	//   command: 'npm run start',
	//   url: 'http://127.0.0.1:3006',
	//   reuseExistingServer: !process.env.CI,
	// },
});
