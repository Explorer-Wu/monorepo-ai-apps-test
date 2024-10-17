import { test as setup, expect } from '@playwright/test';
import { SignPage } from './sign-page-model';
import { USER_STATE_PATH } from '../playwright.config';

setup('authenticate', async ({ page }) => {
	const signMode = new SignPage(page);
	await signMode.login();

	// await page.getByLabel('Password').fill('password');
	// await page.getByText('Sign in').click();

	// Wait until the page actually signs in.
	// await expect(page.getByText('Hello, user!')).toBeVisible();

	// 等待操作
	await page.waitForTimeout(10000);

	// 登录后定向跳转
	await page.waitForURL(`${process.env!.WEBSITE_URL!}/web/geek/job-recommend`, { waitUntil: 'networkidle' });
});

setup.afterEach(async ({ page }) => {
	// 存储 cookie
	await page.context().storageState({ path: USER_STATE_PATH });

	// await page.goto(`${process.env!.WEBSITE_URL!}/web/geek/job-recommend`, { waitUntil: 'networkidle' });
});
