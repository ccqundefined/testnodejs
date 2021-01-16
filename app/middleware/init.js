const goods = require('../model/goods');

// 注意: 在路由配置的中间件必须要传入app全局对象,否则会导致app不可用
module.exports = (options, app) => {
  return async function init(ctx, next) {
    // 获取顶部导航数据
    let topNav = await ctx.service.cache.get('index_topNav');
    if (!topNav) {
      // 获取顶部导航的数据
      topNav = await ctx.model.Nav.find({ position: 1 });
      topNav.sort((a, b) => {
        return a.sort - b.sort;
      });
      await ctx.service.cache.set('index_topNav', topNav, 60 * 60);
    }
    // 商品分类
    let goodsCate = await ctx.service.cache.get('index_goodsCate');
    if (!goodsCate) {
      goodsCate = await ctx.model.GoodsCate.aggregate([
        {
          $lookup: {
            from: 'goods_cate',
            localField: '_id',
            foreignField: 'pid',
            as: 'items',
          },
        },
        {
          $match: { pid: '0' },
        },
      ]);
      for (let i = 0; i < goodsCate.length; i++) {
        goodsCate[i].items.sort((a, b) => {
          return a.sort - b.sort;
        });
      }
      await ctx.service.cache.set('index_goodsCate', goodsCate, 60 * 60);
    }
    // 获取中间导航
    let middleNav = await ctx.service.cache.get('index_middleNav');
    if (!middleNav) {
      middleNav = await ctx.model.Nav.find({ position: 2 });
      middleNav = JSON.parse(JSON.stringify(middleNav));
      const tempRelation = [];
      for (let i = 0; i < middleNav.length; i++) {
        if (middleNav[i].relation) {
          try {
            const tempArr = middleNav[i].relation.replace(/，/g, ',').split(',');
            tempArr.forEach(value => {
              tempRelation.push({
                _id: app.mongoose.Types.ObjectId(value),
              });
            });
            const relationGoods = await ctx.model.Goods.find({
              $or: tempRelation,
            }, 'title goods_img link');
            // console.log(relationGoods);
            middleNav[i].subGoods = relationGoods;
          } catch (e) { // 如果用户输入了错误的objectid
            middleNav[i].subGoods = [];
          }
        } else {
          middleNav[i].subGoods = [];
        }
      }
      await ctx.service.cache.set('index_middleNav', middleNav, 60 * 60);
    }
    ctx.state.topNav = topNav;
    ctx.state.goodsCate = goodsCate;
    ctx.state.middleNav = middleNav;
    await next();
  };
};
