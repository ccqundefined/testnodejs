module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const d = new Date();
  const GoodsImageSchema = new Schema({
    goods_id: { type: String },
    img_url: { type: String },
    color_id: {
      type: Schema.Types.Mixed,
      default: 0,
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
  return mongoose.model('GoodsImage', GoodsImageSchema, 'goods_image');
};
