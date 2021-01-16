'use strict';
// 缓存技术
// 1.文件缓存
// 2.内存缓存
const Controller = require('egg').Controller;

class IndexController extends Controller {
  async index() {
    console.time('indexTime');
    // let topNav = await this.service.cache.get('index_topNav');
    // if(!topNav) {
    //   // 获取顶部导航的数据
    //   topNav = await this.ctx.model.Nav.find({ "position": 1 });
    //   topNav.sort((a, b) => {
    //     return a.sort - b.sort
    //   })
    //   await this.ctx.service.cache.set('index_topNav',topNav,60*60);
    // }
    // 获取轮播图数据
    let focus = await this.ctx.service.cache.get('index_focus');
    if (!focus) {
      focus = await this.ctx.model.Focus.find({ type: 1, status: 1 });
      focus.sort((a, b) => {
        return a.sort - b.sort;
      });
      await this.ctx.service.cache.set('index_focus', focus, 60 * 60);
    }


    // 商品分类
    // let goodsCate = await this.ctx.service.cache.get('index_goodsCate');
    // if(!goodsCate) {
    //   goodsCate = await this.ctx.model.GoodsCate.aggregate([
    //     {
    //       $lookup: {
    //         from: 'goods_cate',
    //         localField: '_id',
    //         foreignField: 'pid',
    //         as: 'items'
    //       }
    //     },
    //     {
    //       $match: { "pid": "0" }
    //     }
    //   ])
    //   for (let i = 0; i < goodsCate.length; i++) {
    //     goodsCate[i].items.sort((a, b) => {
    //       return a.sort - b.sort
    //     })
    //   }
    //   await this.ctx.service.cache.set('index_goodsCate',goodsCate,60*60)
    // }

    // // 获取中间导航的数据 注意: 返回的对象是一个不可扩展的对象
    // let middleNav = await this.ctx.service.cache.get('index_middleNav');
    // if(!middleNav) {
    // middleNav = await this.ctx.model.Nav.find({ "position": 2 });
    // middleNav = JSON.parse(JSON.stringify(middleNav));
    // let tempRelation = [];
    // for (let i = 0; i < middleNav.length; i++) {
    //   if (middleNav[i].relation) {
    //     try {
    //       let tempArr = middleNav[i].relation.replace(/，/g, ',').split(',');
    //       tempArr.forEach(value => {
    //         tempRelation.push({
    //           "_id": this.app.mongoose.Types.ObjectId (value)
    //         })
    //       });
    //       let relationGoods = await this.ctx.model.Goods.find({
    //         $or: tempRelation
    //       }, 'title goods_img');
    //       middleNav[i].subGoods = relationGoods
    //     } catch (e) { //如果用户输入了错误的objectid
    //       middleNav[i].subGoods = [];
    //     }
    //   } else {
    //     middleNav[i].subGoods = [];
    //   }
    // }
    //   await this.ctx.service.cache.set('index_middleNav',middleNav,60*60);
    // }
    // console.log(middleNav)

    // console.log(middleNav)
    // 楼层商品数据的渲染
    // 获取手机分类对应的数据
    // let phoneResult = await this.ctx.model.Goods.find({"cate_id":})
    /*
    1.获取当前分类下面的子分类
    */
    //  let phoneCateIdsResult = await this.ctx.model.GoodsCate.find({"pid":this.app.mongoose.Types.ObjectId('5fd7b0887bdecb440dd0dba1')},'_id');
    // //  console.log(phoneCateIdsResult);
    // //  2.商品列表里面查找分类id 在手机分类的子分类里面的(推荐的)所有数据
    // let cateIdsArr = [];
    // phoneCateIdsResult.forEach(value => {
    //   cateIdsArr.push({
    //     cate_id: value._id
    //   })
    // })
    // let phoneResult = await this.ctx.model.Goods.find({
    //   $or:cateIdsArr
    // })
    let phoneResult = await this.ctx.service.cache.get('index_phoneResult');
    if (!phoneResult) {
      phoneResult = await this.ctx.service.goods.get_category_recommend_goods('5fd7b0887bdecb440dd0dba1', 'best', 8);
      await this.ctx.service.cache.set('index_phoneResult', phoneResult, 60 * 60);
    }
    // let tvResult = await this.ctx.service.goods.get_category_recommend_goods('5fd7b17c9421b0d8d84e5291','best',10);
    // console.log(tvResult);
    await this.ctx.render('default/index', {
      focus,
      phoneResult,
    });
    console.timeEnd('indexTime');
  }
  // 轮播图
  async focus() {

  }
}

module.exports = IndexController;
