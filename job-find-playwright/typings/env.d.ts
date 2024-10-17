declare namespace NodeJS {
  interface ProcessEnv {
    /** 测试模式 */
    NODE_ENV: 'production' | 'development' | 'test';

    /** 测试用户 */
    TEST_USERNAME: string;

    /** 测试用户密码 */
    TEST_PASSWORD: string;

    /** 测试网站域名 */
    WEBSITE_URL: string;
  }
}