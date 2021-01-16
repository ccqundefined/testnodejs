module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const SettingSchema = new Schema({
    site_title: { type: String },
    site_logo: { type: String },
    site_keywords: {
      type: String,
    },
    site_description: {
      type: String,
    },
    no_picture: {
      type: String,
    },
    site_icp: { // 备案信息
      type: String,
    },
    site_tel: { // 电话号码
      type: String,
    },
    search_keywords: { // 热门搜索关键词
      type: String,
    },
    tongji_code: { // 统计代码
      type: String,
    },
  });
  return mongoose.model('Setting', SettingSchema, 'setting');
};
