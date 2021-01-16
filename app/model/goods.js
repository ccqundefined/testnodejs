module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const d = new Date();
  const GoodsSchema = new Schema({
    title: { type: String },
    sub_title: { type: String },
    goods_sn: { type: String },
    cate_id: { type: Schema.Types.ObjectId },
    click_count: {
      type: Number,
      default: 100,
    },
    goods_number: {
      type: Number,
      default: 1000,
    },
    shop_price: {
      type: Number,
      default: 0,
    },
    market_price: {
      type: Number,
      default: 0,
    },
    relation_goods: {
      type: String,
      default: '',
    },
    goods_attrs: {
      type: String,
      default: '',
    },
    goods_version: {
      type: String,
      default: '',
    },
    goods_img: {
      type: String,
      default: '',
    },
    goods_gift: { // 商品赠品
      type: String,
      default: '',
    },
    goods_fitting: { // 商品配件
      type: String,
      default: '',
    },
    goods_color: {
      type: String,
      default: '',
    },
    goods_keywords: {
      type: String,
      default: '',
    },
    goods_desc: { // 商品描述
      type: String,
      default: '',
    },
    goods_content: { // 商品内容
      type: String,
      default: '',
    },
    sort: {
      type: Number,
      default: 100,
    },
    is_delete: { // 是否是软删除
      type: Number,
      default: 0,
    },
    is_hot: {
      type: Number,
      default: 0,
    },
    is_best: {
      type: Number,
      default: 0,
    },
    is_new: {
      type: Number,
      default: 0,
    },
    goods_type_id: {
      type: Schema.Types.Mixed, // 混合类型
    },
    status: {
      type: Number,
      default: 1,
    },
    add_time: {
      type: Number,
      default: d.getTime(),
    },
  });
  return mongoose.model('Good', GoodsSchema, 'goods');
};
