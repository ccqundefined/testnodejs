'use strict';

const BaseController = require('./base');

class GoodsTypeAttributeController extends BaseController {
  async index() {
    // 显示对应类型的属性
    // 获取当前属性的分类id
    const cate_id = this.ctx.request.query.id;
    // console.log(cate_id)
    // const result = this.ctx.model.GoodsTypeAttribute.find({"cate_id": cate_id});
    const result = await this.ctx.model.GoodsTypeAttribute.aggregate([
      {
        $lookup: {
          from: 'goods_type',
          localField: 'cate_id',
          foreignField: '_id',
          as: 'goods_type',
        },
      },
      {
        $match: { // cate_id字符串
          cate_id: this.app.mongoose.Types.ObjectId(cate_id),
        },
      },
    ]);
    // console.log(result);
    // 获取当前类型
    const goods_type = await this.ctx.model.GoodsType.find({ _id: cate_id });
    await this.ctx.render('admin/goodsTypeAttribute/index', {
      list: result,
      cate_id,
      goods_type: goods_type[0],
    });
  }
  async add() {
    // 获取分类id
    const cate_id = this.ctx.request.query.id;
    // 获取类型数据
    const goodsType = await this.ctx.model.GoodsType.find({});
    await this.ctx.render('admin/goodsTypeAttribute/add', {
      cate_id,
      goodsType,
    });
  }
  async doAdd() {
    console.log(this.ctx.request.body);
    const cate_id = this.ctx.request.body.cate_id;
    const res = new this.ctx.model.GoodsTypeAttribute(this.ctx.request.body);
    await res.save();
    await this.success('/admin/goodsTypeAttribute?id=' + cate_id, '增加类型属性成功');
  }
  async edit() {
    const id = this.ctx.request.query.id;
    const result = await this.ctx.model.GoodsTypeAttribute.find({ _id: id });
    const goodsType = await this.ctx.model.GoodsType.find({});
    await this.ctx.render('admin/goodsTypeAttribute/edit', {
      list: result[0],
      goodsType,
    });
  }
  async doEdit() {
    const data = this.ctx.request.body;
    const id = data.id;
    const result = await this.ctx.model.GoodsTypeAttribute.updateOne({ _id: id }, {
      $set: data,
    });
    await this.success('/admin/goodsTypeAttribute?id=' + data.cate_id, '修改商品类型属性成功');
  }
}

module.exports = GoodsTypeAttributeController;
