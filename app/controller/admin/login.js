'use strict';

const BaseController = require('./base.js');

class LoginController extends BaseController {
  async index() {
    await this.ctx.render('admin/login');
  }
  // 执行登录的方法 post
  async doLogin() {
    /*
    // 注意: 1.需要在前端页面用js验证用户输入的信息是否正确
             2.后台获取数据以后判断数据格式是否正确
    1.获取表单提交的数据
    2.判断验证码是否正确
      验证码正确:
        1. 要对表单里面的密码进行md5加密
        2.在用户表(集合) 中查询当前用户是否存在  (mongoose操作mongodb数据库)
        3.如果数据库有此用户(登录成功): 保存用户信息  跳转到后台管理系统
        4.如果数据库没有此用户(登录失败) : 跳转到登录页面
      验证码错误，跳转到登录页面  提示验证码不正确
    */
    // await this.success('/admin/login');
    const verify = this.ctx.request.body.verify.toLowerCase();
    const username = this.ctx.request.body.username;
    const password = await this.service.tools.md5(this.ctx.request.body.password);
    // console.log(username,password,verify,this.ctx.session.code);
    if (verify === this.ctx.session.code) {
      const result = await this.ctx.model.Admin.find({ username, password });
      // console.log(result);
      if (result.length > 0) {
        // 登录成功
        // 1.保存用户信息
        this.ctx.session.userinfo = result[0];
        // console.log(result[0]);
        // 2.跳转到用户中心
        this.ctx.redirect('/admin');
      } else {
        await this.error('/admin/login', '用户或者密码错误');
      }
    } else {
      // 注意: 异步和 await
      await this.error('/admin/login', '验证码错误');
    }
  }
  async loginOut() {
    this.ctx.session.userinfo = null;
    this.ctx.redirect('/admin/login');
  }
}

module.exports = LoginController;
