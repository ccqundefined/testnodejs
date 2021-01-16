'use strict';

const BaseController = require('./base.js');

class NavController extends BaseController {
  async index() {
    const page = this.ctx.query.page || 1;
    const pageSize = 3;
    const totalNum = await this.ctx.model.Nav.find({}).count();
    const navResult = await this.ctx.model.Nav.find({}).skip((page - 1) * pageSize).limit(pageSize);
    // console.log(navResult)
    await this.ctx.render('admin/nav/index', {
      list: navResult,
      totalPages: Math.ceil(totalNum / pageSize),
      page,
    });
    // console.log(Math.ceil(totalNum/pageSize),page)
  }
  async add() {
    await this.ctx.render('admin/nav/add');
  }
  async doAdd() {
    // console.log(this.ctx.request.body)
    const data = this.ctx.request.body;
    const nav = new this.ctx.model.Nav(data);
    const result = await nav.save();
    await this.success('/admin/nav', '增加导航成功');
  }
  async edit() {
    const id = this.ctx.query.id;
    const result = await this.ctx.model.Nav.find({ _id: id });
    await this.ctx.render('admin/nav/edit', {
      list: result[0],
      id,
      prevPage: this.ctx.state.prevPage,
    });
  }
  async doEdit() {
    // console.log(this.ctx.request.body)
    const _id = this.ctx.request.query.id;
    const prevPage = this.ctx.request.body.prevPage;

    const result = await this.ctx.model.Nav.updateOne({ _id }, this.ctx.request.body);
    console.log(this.ctx.request.body, result);
    if (result.n == 1 && result.nModified == 1 && result.ok == 1) {
      await this.success(prevPage, '编辑导航成功');
    } else {
      await this.error(prevPage, '编辑导航失败');
    }

  }
}

module.exports = NavController;
