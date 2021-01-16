'use strict';

const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');

class BaseController extends Controller {
  async success(redirectUrl, message) {
    await this.ctx.render('admin/public/success', {
      redirectUrl,
      message: message || '操作成功！',
    });
  }
  async error(redirectUrl, message) {
    await this.ctx.render('admin/public/error', {
      redirectUrl,
      message: message || '操作失败！',
    });
  }
  async verify() {
    const captcha = await this.service.tools.captcha();
    this.ctx.session.code = captcha.text.toLowerCase(); // 验证码上面的信息
    this.ctx.response.type = 'image/svg+xml'; /* 指定返回的类型 */
    this.ctx.body = captcha.data; /* 给页面返回一张图片*/
  }
  // 封装一个删除方法
  async delete() {
    /*
    1.获取要删除的数据库表 model
    2.获取要删除数据的_id
    3.执行删除操作
    4.返回到以前的页面 ctx.request.headers['referer'] (上一页的地址)
    */
    const model = this.ctx.request.query.model; // Role
    const id = this.ctx.request.query.id;
    //  console.log(model,id);
    await this.ctx.model[model].deleteOne({ _id: id });
    this.ctx.redirect(this.ctx.state.prevPage);
  }
  // 改变状态的方法 API接口
  async changeStatus() {
    // console.log(this.ctx.request.url);
    const model = this.ctx.request.query.model; /* 数据库表名 */
    const attr = this.ctx.request.query.attr; /* 更新的属性 如:status is_best */
    const id = this.ctx.request.query.id; /* 更新的id */
    const result = await this.ctx.model[model].find({ _id: id });
    if (result.length > 0) {
      if (result[0][attr] === 1) {
        var json = { // es6 属性表达式
          [attr]: 0,
        };
      } else {
        var json = {
          [attr]: 1,
        };
      }
      const updateResult = await this.ctx.model[model].updateOne({ _id: id }, { $set: json });
      if (updateResult) {
        this.ctx.body = { message: '更新成功', success: true };
      } else {
        this.ctx.body = { message: '更新失败', success: false };
      }
    } else {
      // 接口的写法
      this.ctx.body = { message: '更新失败参数错误', success: false };
    }
  }
  async editNum() {
    const model = this.ctx.request.query.model;
    const attr = this.ctx.request.query.attr;
    const id = this.ctx.request.query.id;
    const num = this.ctx.request.query.num;
    const result = await this.ctx.model[model].find({ _id: id });
    if (result.length > 0) {
      const json = {
        [attr]: num,
      };
      // 执行更新操作
      const updateResult = await this.ctx.model[model].updateOne({ _id: id }, json);
      if (updateResult) {
        this.ctx.body = { message: '更新成功', success: true };
      } else {
        this.ctx.body = { message: '更新失败', success: false };
      }
    } else {
      this.ctx.body = { message: '更新失败,参数错误', success: false };
    }

  }
}

module.exports = BaseController;
