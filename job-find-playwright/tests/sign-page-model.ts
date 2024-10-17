import { expect, type Page, type ElementHandle } from '@playwright/test';
// import { nanoid } from 'nanoid';

export class SignPage {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async loadPage() {
		// await this.page.goto(URL_BASE + '/onboarding');
		await this.page.goto(`${process.env!.WEBSITE_URL!}/web/user/?ka=header-login`, { timeout: 10000 });
		await this.page.waitForSelector('#wrap .page-sign');
		// page-sign .login-register-unite  switch-tip

		// 等待页面稳定无网络请求
		await this.page.waitForLoadState('networkidle');
	}

	async login() {
		const { page } = this;
		await this.loadPage();

		// const campaignName = 'E2E 测试活动' + nanoid();
		// await this.page.fill('#userName', 'Name' + nanoid());
		// await this.page.fill('#userEmail', nanoid() + '@a.test');
		// await this.page.fill('#campaignName', campaignName);
		// await this.page.fill('#campaignReward_0', nanoid());
		// await this.page.click('button[type="submit"]');

		// 登录授权
		// await page.waitForSelector('button[class="ant-btn ant-btn-primary ant-btn-lg"]');

		// 等待切换app扫码按钮出现
		const switchBtn = (await page.$('.btn-sign-switch')) as ElementHandle;
		await switchBtn.click();
		// 等待App二维码出现
		await page.waitForSelector('.qr-code-box .qr-img-box img', { timeout: 10000 });

		// 等待页面稳定无网络请求
		await page.waitForLoadState('networkidle');
		// 等待操作
		// await page.waitForTimeout(10000);

		// const recommendSelector = page.locator('#wrap .job-recommend-main .recommend-job-btn.active');
		// await expect(recommendSelector).toBeVisible();

		// await page.fill('input[id="username"]', 'admin');
		// await page.fill('input[id="password"]', 'ant.design');
		// await page.click('button[class="ant-btn ant-btn-primary ant-btn-lg"]');

		// await expect(page.getByRole('button', { name: 'View profile and more' })).toBeVisible();
	}
}
