'use strict';

const Service = require('egg').Service;
/*
    根据商品分类获取推荐商品
    @params{string} cate_id -分类id
    @params{String} type - hot best new
    @params{Number} limit - 查找的数量
*/
class GoodsService extends Service {
  async get_category_recommend_goods(cate_id, type, limit) {
    try {
      let cateIdsResult = await this.ctx.model.GoodsCate.find({ pid: this.app.mongoose.Types.ObjectId(cate_id) });
      if (cateIdsResult.length == 0) {
        cateIdsResult = [{ _id: cate_id }];
      }
      //  2.商品列表里面查找分类id 在手机分类的子分类里面的(推荐的)所有数据
      const cateIdsArr = [];
      cateIdsResult.forEach(value => {
        cateIdsArr.push({
          cate_id: value._id,
        });
      });
      // 查找条件
      let findJson = {
        $or: cateIdsArr,
      };
      // 判断类型
      switch (type) {
        case 'hot':
          findJson = Object.assign(findJson, { is_hot: 1 });
          break;
        case 'best':
          findJson = Object.assign(findJson, { is_best: 1 });
          break;
        case 'new':
          findJson = Object.assign(findJson, { is_new: 1 });
          break;
        default:
          findJson = Object.assign(findJson, { is_hot: 1 });
          break;
      }
      const limitSize = limit || 10;
      return await this.ctx.model.Goods.find(findJson, 'title shop_price goods_img sub_title').limit(limitSize);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
  /*
  把商品id的字符串转换成数组
  @parmam {string} str-ids的字符串
  */
  async strToArray(str) {
    try {
      if (str) {
        let tempArr = str.replace(/，/g, ',').split(',');
        let tempIds = [];
        for (let i = 0; i < tempArr.length; i++) {
          if (tempArr[i] && tempArr[i].length == 24 && typeof tempArr[i] == 'string') {
            tempIds.push({
              "_id": this.app.mongoose.Types.ObjectId(tempArr[i])
            })
          }
        }
        return tempIds
      }
      return [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}

module.exports = GoodsService;
