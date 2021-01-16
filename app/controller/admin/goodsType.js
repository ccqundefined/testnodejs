'use strict';

const BaseController = require('./base');

class GoodsTypeController extends BaseController {
  async index() {
    // 查询商品类型表
    const res = await this.ctx.model.GoodsType.find({});
    await this.ctx.render('admin/goodsType/index', {
      list: res,
    });
  }
  async add() {
    await this.ctx.render('admin/goodsType/add');
  }
  async doAdd() {
    // console.log(this.ctx.request.body)
    const data = this.ctx.request.body;
    const res = new this.ctx.model.GoodsType({
      title: data.title,
      description: data.description,
    });
    await res.save();
    await this.success('/admin/goodsType', '增加商品类型成功');
  }
  async edit() {
    const id = this.ctx.request.query.id;
    const res = await this.ctx.model.GoodsType.find({ _id: id });
    console.log(res);
    await this.ctx.render('admin/goodsType/edit', {
      list: res[0],
    });
  }
  async doEdit() {
    // console.log(this.ctx.request.body)
    const _id = this.ctx.request.body._id;
    const title = this.ctx.request.body.title;
    const description = this.ctx.request.body.description;
    const result = await this.ctx.model.GoodsType.updateOne({ _id }, {
      $set: {
        title,
        description,
      },
    });
    await this.success('/admin/goodsType', '编辑商品类型成功');
  }
}

module.exports = GoodsTypeController;
