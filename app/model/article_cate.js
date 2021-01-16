module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const d = new Date();
  const ArticleCateSchema = new Schema({
    title: { type: String },
    cate_img: { type: String },
    link: { // 跳转的地址
      type: String,
    },
    pid: {
      type: Schema.Types.Mixed, // 混合类型
    },
    sub_title: { // seo相关的标题 关键字 描述
      type: String,
      default: '',
    },
    keywords: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: Number,
      default: 1,
    },
    sort: {
      type: Number,
      default: 100,
    },
    add_time: {
      type: Number,
      default: d.getTime(),
    },
  });
  return mongoose.model('ArticleCate', ArticleCateSchema, 'article_cate');
};
