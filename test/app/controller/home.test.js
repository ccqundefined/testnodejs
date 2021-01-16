'use strict';
const { app } = require('egg-mock/bootstrap');

describe('test/controller/home.test.js', () => {
  describe('GET /', () => {
    it('should status 200 and get the body', () => {
      // 对 app 发起 `GET /` 请求
      return app.httpRequest()
        .get('/')
        .expect(200); // 期望返回 status 200
    });
  });
});
