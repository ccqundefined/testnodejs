'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    this.ctx.body = '登录';
  }
  async register() {
    this.ctx.body = '注册';
  }
  async welcome() {
    this.ctx.body = '欢迎首页';
  }
  async order() {
    this.ctx.body = '订单';
  }
  async address() {
    this.ctx.body = '收货地址';
  }
}

module.exports = UserController;
