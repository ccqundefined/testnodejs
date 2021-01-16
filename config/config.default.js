/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1606921266069_5648';
  // 配置session
  config.session = {
    key: 'EGG_SESS',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: true, // session加密
    renew: true, // 延长会话周期
  };

  // add your middleware config here
  config.middleware = [ 'adminauth' ];
  // 配置局部路由
  config.adminauth = {
    match: '/admin',
  };
  // 配置ejs模板引擎
  config.view = {
    mapping: {
      '.html': 'ejs',
      '.nj': 'nunjucks',
    },
  };
  // 配置mongoose
  config.mongoose = {
    client: {
      url: 'mongodb://xiaomiadmin:123456@localhost:127.0.0.1/eggxiaomi',
      options: {},
      // mongoose global plugins, expected a function or an array of function and options
      // plugins: [createdPlugin, [updatedPlugin, pluginOptions]],
    },
  };
  // 配置允许上传的文件，以及可上传的文件大小 默认大小10mb
  // config. multipart = {
  //   whitelist: [ '.png' ] // 覆盖默认支持上传文件格式
  // }
  // 配置 上传图片允许的表单数量
  config.multipart = {
    fields: '50',
  };
  //
  config.security = {
    csrf: {
    // 判断是否需要ignore的方法，请求上下文context作为第一个参数
      ignore: ctx => {
        if (ctx.url === '/admin/goods/uploadImg' || '/admin/goods/uploadPhoto') {
          return true;
        }
        return false;
      },
    },
  };
  config.uploadDir = 'app/public/admin/upload';
  // 定义缩略图的尺寸
  config.jimpSize = [
    {
      width: 151,
      height: 151,
    },
    {
      width: 400,
      height: 400,
    },
  ];
  // redis数据库连接地址
  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  };
  // add your user config here
  const userConfig = {
    myAppName: 'damiegg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
