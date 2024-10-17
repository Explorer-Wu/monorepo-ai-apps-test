/**
 * 这里面都是模拟dom的操作
 */
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// 读取简历信息
function getResumeInfo() {
	try {
		const data = fs.readFileSync(path.resolve(__dirname, './doc/我的简历信息.txt'), 'utf8');
		// 输出文件内容
		return data;
	} catch (err) {
		console.error('读取文件时出错:', err);
	}

	// try {
	// 	const txtpath = path.resolve(__dirname, '../assets/doc/我的求职信.txt');
	// 	const data: any = await fs.readFile(txtpath, { encoding: 'utf8' });
	// 	// 输出文件内容
	// 	return data;
	// } catch (err: any) {
	// 	console.error('读取文件时出错:', err);
	// }
}

// 进入求职界面后的推荐岗位
async function getRecommendJobFilter(page: any) {
	// 添加推荐选择
	const recommendJobButton = page.locator("//*[@id='wrap']/div[2]/div[1]/div/div[1]/a[5]");
	await recommendJobButton.click();

	// 过滤条件
	// const filterPayButton = page.locator("//*[@id='wrap']/div[2]/div[1]/div/div[2]/div[2]");
	// await page.waitForLoadState('networkidle');
	await page.hover("//*[@id='wrap']/div[2]/div[1]/div/div[2]/div[2]");
	await page.waitForSelector("//*[@id='wrap']/div[2]/div[1]/div/div[2]/div[2]/div[2]/ul/li[6]");
	//定位目标元素。如果鼠标不悬浮的话，是找不到这个元素的。
	await page.locator("//*[@id='wrap']/div[2]/div[1]/div/div[2]/div[2]/div[2]/ul/li[6]").click();

	const filterExpButton = page.locator("//*[@id='wrap']/div[2]/div[1]/div/div[2]/div[3]");
	await filterExpButton.hover(); // { timeout: 1000 }
	await page.waitForSelector("//*[@id='wrap']/div[2]/div[1]/div/div[2]/div[3]/div[2]/ul/li[4]");
	const filterExpOptItem = page.locator("//*[@id='wrap']/div[2]/div[1]/div/div[2]/div[3]/div[2]/ul/li[4]");
	await filterExpOptItem.click();
}

// 根据索引获取职位描述
async function getJobKeyWordByIndex(index: any, page: any): Promise<string> {
	try {
		const jobSelector = `//*[@id='wrap']/div[2]/div[2]/div/div/div[1]/ul/li[${index}]`;
		const jobElement = await page.locator(jobSelector);
		// 点击招聘信息列表中的项
		await jobElement.click();

		const jobNamePath = `//*[@id='wrap']/div[2]/div[2]/div/div/div[1]/ul/li[${index}]/div[1]/div/a`;
		const jobNameEle = await page.locator(jobNamePath);
		return jobNameEle.innerText();
		// return jobNameText;
	} catch (error) {
		console.log(`在索引 ${index} 处找不到职位关键词。`);
		return '';
	}
}

// 根据索引获取职位描述
async function getJobDescriptionByIndex(index: any, page: any): Promise<any> {
	try {
		const jobSelector = `//*[@id='wrap']/div[2]/div[2]/div/div/div[1]/ul/li[${index}]`;
		const jobElement = await page.locator(jobSelector);
		// 点击招聘信息列表中的项
		await jobElement.click();

		// 找到描述信息节点并获取文字
		const descriptionSelector = "//*[@id='wrap']/div[2]/div[2]/div/div/div[2]/div/div[2]/p";
		await page.waitForSelector(descriptionSelector);
		const jobDescriptionElement = await page.locator(descriptionSelector);
		return jobDescriptionElement.innerText();
	} catch (error) {
		console.log(`在索引 ${index} 处找不到工作。`);
		return null;
	}
}

export { getResumeInfo, getRecommendJobFilter, getJobDescriptionByIndex, getJobKeyWordByIndex };
