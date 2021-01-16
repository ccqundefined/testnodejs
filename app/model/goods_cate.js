module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const d = new Date();
  const goodsCateSchema = new Schema({
    title: { type: String },
    cate_img: { type: String },
    filter_attr: { // 筛选
      type: String,
    },
    link: { // 跳转的地址
      type: String,
    },
    template: { // 指定当前分类的模板
      type: String,
    },
    pid: {
      type: Schema.Types.Mixed, // 混合类型
    },
    sub_title: { // seo相关的标题 关键字 描述
      type: String,
    },
    keywords: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
    },
    sort: {
      type: Number,
      default: 100,
    },
    keywords: {
      type: String,
    },
    add_time: {
      type: Number,
      default: d.getTime(),
    },
  });
  return mongoose.model('GoodsCate', goodsCateSchema, 'goods_cate');
};
