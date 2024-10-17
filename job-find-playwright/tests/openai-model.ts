import { OpenAI } from 'openai';
import { expect, type Page, type ElementHandle } from '@playwright/test';
// import { nanoid } from 'nanoid';
import { getResumeInfo, getRecommendJobFilter, getJobDescriptionByIndex, getJobKeyWordByIndex } from './domOperateMock';

// 初始化OpenAI客户端
const openai = new OpenAI({
	baseURL: 'https://api.chatanywhere.com.cn',
	apiKey: 'sk-iwca9XQBeTMCUA7WW967SWG3EyUC702NcBo6JnLOBqS5xIt6',
});

// 获取简历信息
const resumeInfo: any = getResumeInfo();

// 与GPT进行聊天的函数
export async function chat(jobDescription: any) {
	const askMessage = `您好，这是我的求职内容：${resumeInfo}。我希望您能帮我简单给HR写一个礼貌专业的求职新消息，要求结合我的求职内容，请您始终使用中文来进行消息的编写,开头是招聘负责人。这是一封完整的求职信，不要包含我的求职内容以外的不真实的东西，例如“多少年工作经验”这一类的内容，以便于我直接自动化复制粘贴发送，字数控制在100字左右为宜`;
	try {
		const completion: any = await openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content: askMessage,
				},
			],
			model: 'gpt-3.5-turbo',
		});

		// 获取gpt返回的信息
		const formattedMessage = completion.choices[0].message.content.replace(/\n/g, ' ');
		return formattedMessage;
	} catch (error: unknown) {
		console.error(`gpt返回时发生错误: ${error}`);
		const errorResponse = JSON.stringify({ error: String(error) });
		return errorResponse;
	}
}

// 发送响应到聊天框
export async function sendResponseToChatBox(page: any, response: any) {
	try {
		// 请找到聊天输入框
		const chatInput = "//*[@id='chat-input']";
		const chatBox = page.locator(chatInput);
		// 清除输入框中可能存在的任何文本
		await chatBox.fill('');

		// 将响应粘贴到输入框
		await page.fill(chatInput, response);
		// await page.locator(chatInput).fill(response);
		await page.waitForTimeout(1000);
		// 获取键盘对象
		// const keyboard = page.keyboard
		// 使用 press() 方法模拟按下并释放回车键
		// keyboard.press('Enter')

		// 模拟按下回车键来发送消息
		await page.press(chatInput, 'Enter');
		await page.waitForTimeout(2000); // 模拟等待2秒
	} catch (error) {
		console.error(`发送响应到聊天框时发生错误: ${error}`);
	}
}

// 主函数
export async function mainWebFindJob(url: string, browserType: string, page: any) {
	try {
		// 开始的索引
		let jobIndex = 1;
		let isJobKeyWord = true;

		// console.log('isLogin:', isLogin);
		while (true) {
			if (isJobKeyWord) await getRecommendJobFilter(page);

			// 获取对应下标的职位描述
			const jobDescription = await getJobDescriptionByIndex(jobIndex, page);
			const jobKeyWord: string = await getJobKeyWordByIndex(jobIndex, page);

			if (jobKeyWord) {
				for (let text of ['前端', 'web', 'react', 'vue']) {
					if (jobKeyWord!.indexOf(text) === -1) isJobKeyWord = false;
					else isJobKeyWord = true;
				}
			}
			// console.log(`职位描述信息/n：${jobDescription}`);

			if (isJobKeyWord) {
				// 发送描述到聊天并打印响应
				const response = chat(jobDescription);
				resumeInfo.toString();
				console.log('gpt给的回复', response, jobKeyWord);

				// 点击沟通按钮
				const contactPath = "//*[@id='wrap']/div[2]/div[2]/div/div/div[2]/div/div[1]/div[2]/a[last()]";
				await page.waitForSelector(contactPath);
				const contactButton = await page.locator(contactPath);
				contactButton.click();

				// 等待回复框出现
				// await page.waitForSelector("//*[contains(@class,'greet-boss-dialog')]");
				const tipPath = "//*[contains(@class,'greet-boss-dialog')]/div[2]/div[3]/a[2]";
				await page.waitForSelector(tipPath);
				await page.locator(tipPath).click();

				await page.waitForSelector("//*[@id='chat-input']");

				// 调用函数发送响应
				await sendResponseToChatBox(page, response);

				// 返回到上一个页面
				await page.goBack();

				// 模拟等待3秒
				await page.waitForTimeout(3000);
			}
			jobIndex += 1;
		}
	} catch (error) {
		console.error(`发生错误: ${error}`);
	}
}
