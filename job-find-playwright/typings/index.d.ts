/**
 * @filename global.d.ts
 * @description 全局ts声明
 */
declare global {
  // const process: { 与 @types/node重复
  //   env: {
  //     NODE_ENV: string
  //   }
  // }
  // namespace JSX {
  //   interface IntrinsicAttributes {
  //     class?: any
  //     style?: any
  //   }
  // }
  // 全局变量设置
  // const _: typeof lodash;

  interface Window {
    ActiveXObject: boolean
    webkitIndexedDB: boolean
    mozIndexedDB: boolean
    scrollHeight: number
    scrollTop: number
    clientHeight: number
  }
}


//  declare const REACT_APP_ENV: 'test' | 'dev' | 'uat' | 'prod' | false;

//client.d.ts 中有声明模块 '*.svg'、'*.jpg'、'*.png'、'*.gif'、'*.css'、'*.scss'、'*.sass'、'*.less'、'*.styl'等等;
  

declare module 'mockjs';
declare module '*.ts';
declare module '*.tsx';

declare module 'slash2';
declare module '*.bmp';
declare module '*.tiff';

export {}
