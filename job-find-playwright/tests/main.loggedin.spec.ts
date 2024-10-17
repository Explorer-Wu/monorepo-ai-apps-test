import { test, expect } from '@playwright/test';
// import { SignPage } from './sign-page-model';
import { USER_STATE_PATH } from '../playwright.config';
// import { getRecommendJobFilter, getJobDescriptionByIndex, getJobKeyWordByIndex } from './domOperateMock';
import { mainWebFindJob } from './openai-model';

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

test.describe('测试环境进入主页面', () => {
	// test.beforeEach(async ({ page }) => {
	// 	// const signMode = new SignPage(page);
	// 	// await signMode.login();
	// 	await page.goto(`${process.env!.WEBSITE_URL!}`, { timeout: 20000 }); // /web/user/?ka=header-login
	// });

	test.use({ storageState: USER_STATE_PATH });

	test('登录后初始化筛选条件', async ({ page }) => {
		// 与 playwright.config.ts 一样，测试脚本中也可以访问环境变量
		console.log('WEBSITE_URL:', process.env.WEBSITE_URL); // ?ka=header-job-recommend
		await page.goto(`${process.env!.WEBSITE_URL!}/web/geek/job-recommend`, { waitUntil: 'networkidle' });

		// await page.waitForSelector('#wrap .job-recommend-main .recommend-job-btn');

		// const recommendJobButton = page.locator('#wrap .job-recommend-main .recommend-search-expect > a:nth-child(3)');
		// .getByRole('img').getByText('前端开发工程师（南京）')

		const url = 'https://www.zhipin.com/web/geek/job-recommend?ka=header-job-recommend';
		const browserType = 'chrome';

		await mainWebFindJob(url, browserType, page);
	});

	// 用例完成后执行，可以用来删除测试遗留数据
	// test.afterEach(async ({ page }) => {
	//
	// });
});
