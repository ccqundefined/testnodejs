'use strict';

const Controller = require('egg').Controller;

class ProductController extends Controller {
  async list() {
    /*
    1.获取分类id cid
    2.根据分类id获取当前的分类信息
    3.判断是不是顶级分类
    4.如果是二级分类，直接获取二级分类下面的数据，如果是顶级分类获取下面的二级分类 根据二级分类获取下面所有的数据
    */
    /* 判断cid是顶级分类还是二级分类*/
    const cid = this.ctx.request.query.cid;
    // 1.获取当前的分类
    const currentCate = await this.ctx.model.GoodsCate.find({ _id: cid });
    if (currentCate[0].pid != 0) {
      // 二级分类
      var goodsList = await this.ctx.model.Goods.find({ cate_id: cid }, 'title price sub_title');
      // console.log(goodsList);
    } else {
      // 顶级分类
      // 获取顶级分类下面的所有的子分类
      const subCateIds = await this.ctx.model.GoodsCate.find({ pid: this.app.mongoose.Types.ObjectId(cid) }, '_id');
      // console.log(subCateIds);
      const tempArr = [];
      for (let i = 0; i < subCateIds.length; i++) {
        tempArr.push({
          cate_id: this.app.mongoose.Types.ObjectId(subCateIds[i]._id),
        });
      }
      var goodsList = await this.ctx.model.Goods.find({ $or: tempArr }, 'title price sub_title goods_img shop_price');
    }
    // console.log(currentCate);
    const tpl = currentCate[0].template ? currentCate[0].template : 'default/product_list.html';
    await this.ctx.render(tpl, {
      goodsList,
    });
  }
  async info() {
    // 获取商品id
    // 1.获取商品信息
    const id = this.ctx.request.query.id;
    const productInfo = await this.ctx.model.Goods.find({ _id: id });
    // console.log(productInfo);
    // 2.关联商品的id
    const relationGoodsIds = productInfo[0].relation_goods;
    // 3.处理关联商品
    let relationGoodsArr = await this.ctx.service.goods.strToArray(relationGoodsIds);
    let relationGoods = [];
    if (relationGoodsArr.length > 0) {
      relationGoods = await this.ctx.model.Goods.find({ $or: relationGoodsArr }, 'goods_version shop_price')
    }
    // 4.获取关联颜色
    // console.log(productInfo)
    const goodsColorIds = productInfo[0].goods_color;
    const goodsColor = await this.ctx.service.goods.strToArray(goodsColorIds);
    let colorArr = [];
    if (goodsColor.length > 0) {
      colorArr = await this.ctx.model.GoodsColor.find({ $or: goodsColor });
    }
    // 5.关联赠品
    const goodsFitting = productInfo[0].goods_fitting;
    const goodsFittingArr = await this.ctx.service.goods.strToArray(goodsFitting);
    const fitting = [];
    if (goodsFittingArr.length > 0) {
      fitting = await this.ctx.model.Goods.find({ $or: goodsFittingArr });
    }
    // 6.当前商品关联的图片
    const goodsImageResult = await this.ctx.model.GoodsImage.find({"goods_id":id}).limit(8)
    // 7.获取规格参数信息
    const goodsAttr = await this.ctx.model.GoodsAttr.find({"goods_id":id})
    await this.ctx.render('default/product_info.html', {
      productInfo: productInfo[0],
      relationGoods,
      colorArr,
      fitting,
      goodsImageResult,
      goodsAttr
    });
  }
  // 根据颜色以及商品id获取商品图片信息
  async getImageList() {
    try {
      const color_id = this.ctx.request.query.color_id;
      const goods_id = this.ctx.request.query.goods_id;
      const goods_image = await this.ctx.model.GoodsImage.find({ "goods_id": goods_id, "color_id": this.app.mongoose.Types.ObjectId(color_id) });
      if(goods_image.length === 0) {
        goods_image = await this.ctx.model.GoodsImage.find({"goods_id":goods_id}).limit(8)
      }
      this.ctx.body = { "success": true , "result": goods_image };
    } catch (e) {
      console.error(e);
      this.ctx.body = {"success": false, "result": []}
    }
  }
}

module.exports = ProductController; 
