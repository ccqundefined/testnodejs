'use strict';

const BaseController = require('./base');
const fs = require('fs');
const pump = require('mz-modules/pump');

class GoodsController extends BaseController {
  async index() {
    const page = this.ctx.request.query.page || 1;
    const pageSize = 2;
    // 获取关键词
    const keywords = this.ctx.query.keyword;
    let json = {};
    if (keywords) {
      json = Object.assign({ title: { $regex: new RegExp(keywords) } });
    }
    // 获取当前数据库表的总数量
    const totalNum = await this.ctx.model.Goods.find(json).count();
    const goodsResult = await this.ctx.model.Goods.find(json).skip((page - 1) * pageSize).limit(pageSize);
    await this.ctx.render('admin/goods/index', {
      list: goodsResult,
      totalNum: Math.ceil(totalNum / pageSize),
      page,
      keywords,
    });
  }
  async add() {
    //   获取所有的颜色值
    const colorResult = await this.ctx.model.GoodsColor.find({});
    // 获取所有的商品类型
    const goodsType = await this.ctx.model.GoodsType.find({});
    // 获取商品分类
    const goodsCate = await this.ctx.model.GoodsCate.aggregate([
      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },
    ]);
    // console.log(colorResult);
    // console.log(goodsCate)
    await this.ctx.render('admin/goods/add', {
      colorResult,
      goodsType,
      goodsCate,

    });
  }
  async doAdd() {
    //   console.log(this.ctx.request.body)
    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    const saveData = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;
      const dir = await this.ctx.service.tools.getUploadFile(stream.filename);
      var target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
      // console.log(Object.assign(files,parts.field))
    }
    const formFields = Object.assign(files, parts.field);
    // 生成缩略图
    await this.service.tools.jimpImg(target);
    // console.log(formFields);
    let str = '';
    if (formFields.goods_color) {
      for (let i = 0; i < formFields.goods_color.length; i++) {
        str += (formFields.goods_color[i] + ',');
      }
      formFields.goods_color = str;
    }

    // 1.增加商品信息
    const goodsRes = new this.ctx.model.Goods(formFields);

    const result = await goodsRes.save();
    // console.log(result._id);
    // 2.增加图库信息
    if (result._id) {
      let goods_image_list = formFields.goods_image_list;
      if (goods_image_list) {
        // 解决上传一个图库不是数组的问题
        if (typeof goods_image_list === 'string') {
          goods_image_list = new Array(goods_image_list);
        }
        for (let i = 0; i < goods_image_list.length; i++) {
          const goodsImageres = new this.ctx.model.GoodsImage({
            goods_id: result._id,
            img_url: goods_image_list[i],

          });
          await goodsImageres.save();

        }
      }
    }
    // 3.增加商品类型数据
    let attr_value_list = formFields.attr_value_list;
    let attr_id_list = formFields.attr_id_list;
    if (result._id && attr_id_list && attr_value_list) {
      // 解决只有一个属性的时候存在的bug
      if (typeof attr_id_list === 'string') {
        attr_id_list = new Array(attr_id_list);
        attr_value_list = new Array(attr_value_list);
      }
      for (let i = 0; i < attr_value_list.length; i++) {
        // 查询goods_type_attribute
        if (attr_value_list[i]) {
          const goodsTypeAttributeRes = await this.ctx.model.GoodsTypeAttribute.find({ _id: attr_id_list[i] });
          const goodsAttrRes = new this.ctx.model.GoodsAttr({
            goods_id: result._id,
            cate_id: formFields.cate_id,
            attribute_id: attr_id_list[i],
            attribute_type: goodsTypeAttributeRes[0].attr_type,
            attribute_title: goodsTypeAttributeRes[0].title,
            attribute_value: attr_value_list[i],
          });
          await goodsAttrRes.save();
        }

      }
    }
    await this.success('/admin/goods', '增加商品数据成功');
  }
  async edit() {
    // 获取修改数据的id
    const id = this.ctx.request.query.id;
    //   获取所有的颜色值
    const colorResult = await this.ctx.model.GoodsColor.find({});
    // 获取所有的商品类型
    const goodsType = await this.ctx.model.GoodsType.find({});
    // 获取商品分类
    const goodsCate = await this.ctx.model.GoodsCate.aggregate([
      {
        $lookup: {
          from: 'goods_cate',
          localField: '_id',
          foreignField: 'pid',
          as: 'items',
        },
      },
      {
        $match: {
          pid: '0',
        },
      },
    ]);
    // 获取修改的商品
    const goodsResult = await this.ctx.model.Goods.find({ _id: id });
    // 获取当前商品的颜色
    const colorArrTemp = goodsResult[0].goods_color.split(',');
    const goodsColorArr = [];
    colorArrTemp.forEach(val => {
      if (val) {
        goodsColorArr.push({
          _id: val,
        });
      }
    });
    let goodsColorResult = [];
    if (goodsColorArr.length > 0) {
      goodsColorResult = await this.ctx.model.GoodsColor.find({
        $or: goodsColorArr,
      });
    }
    // console.log(goodsColorResult)
    // 获取规格信息(待定)
    const goodsAttrsResult = await this.ctx.model.GoodsAttr.find({ goods_id: id });
    // console.log(goodsAttrsResult)
    let goodsAttrsStr = '';
    goodsAttrsResult.forEach(async val => {
      if (val.attribute_type == 1) {
        goodsAttrsStr += `<li><span>${val.attribute_title}:</span><input type="hidden" name="attr_id_list" 
        value="${val.attribute_id}"><input type="text" name="attr_value_list" value="${val.attribute_value}"></li>`;
      } else if (val.attribute_type == 2) {
        goodsAttrsStr += `<li><span>${val.attribute_title}:</span><input type="hidden" name="attr_id_list" 
        value="${val.attribute_id}"><textarea name='attr_value_list' cols='50' rows='8'>${val.attribute_value}</textarea></li>`;
      } else {
        // 获取 attr_value
        const oneGoodsTypeAttributeResult = await this.ctx.model.GoodsTypeAttribute.find({
          _id: val.attribute_id,
        });
        const arr = oneGoodsTypeAttributeResult[0].attr_value.split('\n');
        goodsAttrsStr += `<li><span>${val.attribute_title}: </span> <input type="hidden" name="attr_id_list" value="${val.attribute_id}">`;
        goodsAttrsStr += '<select name="attr_value_list">';
        for (let j = 0; j < arr.length; j++) {
          if (arr[j] == val.attribute_value) {
            goodsAttrsStr += `<option value="${arr[j]}" selected>${arr[j]}</option>`;
          } else {
            goodsAttrsStr += `<option value="${arr[j]}">${arr[j]}</option>`;
          }
        }
        goodsAttrsStr += '</select>';
        goodsAttrsStr += '</li>';
      }
    });
    // console.log(goodsAttrsStr)
    // 获取商品的图库信息
    const goodsImageResult = await this.ctx.model.GoodsImage.find({ goods_id: id });
    // console.log(goodsResult);
    // console.log(colorResult);
    // console.log(goodsCate)
    await this.ctx.render('admin/goods/edit', {
      colorResult,
      goodsType,
      goodsCate,
      goods: goodsResult[0],
      goodsAttr: goodsAttrsStr,
      goodsImage: goodsImageResult,
      goodsColorResult,
      prevPage: this.ctx.state.prevPage,
    });
    // console.log(goodsImageResult)
  }
  async doEdit() {
    //   console.log(this.ctx.request.body)
    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;
      const dir = await this.ctx.service.tools.getUploadFile(stream.filename);
      var target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
      // console.log(Object.assign(files,parts.field))
    }
    const formFields = Object.assign(files, parts.field);
    // 生成缩略图
    await this.service.tools.jimpImg(target);
    // 修改商品的id
    const goods_id = parts.field.id;

    // console.log(formFields)
    let str = '';
    if (formFields.goods_color) {
      for (let i = 0; i < formFields.goods_color.length; i++) {
        str += (formFields.goods_color[i] + ',');
      }
      formFields.goods_color = str;
    }

    // 1.修改商品信息
    await this.ctx.model.Goods.updateOne({ _id: goods_id }, formFields);
    // console.log(result._id);
    // 2.修改图库信息(增加操作)
    if (goods_id) {
      let goods_image_list = formFields.goods_image_list;
      if (goods_image_list) {
        // 解决上传一个图库不是数组的问题
        if (typeof goods_image_list === 'string') {
          goods_image_list = new Array(goods_image_list);
        }
        for (let i = 0; i < goods_image_list.length; i++) {
          const goodsImageres = new this.ctx.model.GoodsImage({
            goods_id,
            img_url: goods_image_list[i],

          });
          await goodsImageres.save();

        }
      }
    }
    // 三.修改商品类型数据: 1.删除以前的类型数据 2.重新增加新的商品类型数据
    // 删除以前的类型数据
    await this.ctx.model.GoodsAttr.deleteMany({ goods_id });
    // 重新增加新的商品类型数据
    let attr_value_list = formFields.attr_value_list;
    let attr_id_list = formFields.attr_id_list;
    if (goods_id && attr_id_list && attr_value_list) {
      // 解决只有一个属性的时候存在的bug
      if (typeof attr_id_list === 'string') {
        attr_id_list = new Array(attr_id_list);
        attr_value_list = new Array(attr_value_list);
      }
      for (let i = 0; i < attr_value_list.length; i++) {
        // 查询goods_type_attribute
        if (attr_value_list[i]) {
          const goodsTypeAttributeRes = await this.ctx.model.GoodsTypeAttribute.find({ _id: attr_id_list[i] });
          const goodsAttrRes = new this.ctx.model.GoodsAttr({
            goods_id,
            cate_id: formFields.cate_id,
            attribute_id: attr_id_list[i],
            attribute_type: goodsTypeAttributeRes[0].attr_type,
            attribute_title: goodsTypeAttributeRes[0].title,
            attribute_value: attr_value_list[i],
          });
          await goodsAttrRes.save();
        }

      }
    }
    const prevPage = parts.field.prevPage;
    console.log;
    await this.success(prevPage, '修改商品数据成功');
  }
  // 获取对应的商品类型属性 API接口
  async goodsTypeAttribute() {
    const cate_id = this.ctx.request.query.cate_id;
    const goodsTypeAttribute = await this.ctx.model.GoodsTypeAttribute.find({ cate_id });
    this.ctx.body = {
      result: goodsTypeAttribute,
    };
  }
  //   上传商品详情的图片
  async uploadImage() {
    // 实现图片上传
    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    const saveData = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;
      const dir = await this.ctx.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
      //   生成缩略图
      this.service.tools.jimpImg(target);
    }

    //   console.log(files);
    //  图片地址转换成 {link: 'path/to/image.jpg'} 这种格式
    this.ctx.body = { link: files.file };
  }
  //   上传相册的图片
  async uploadPhoto() {
    // 实现图片上传
    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    const saveData = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;
      const dir = await this.ctx.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }
    // console.log(files);
    //  图片地址转换成 {link: 'path/to/image.jpg'} 这种格式
    this.ctx.body = { link: files.file };
  }
  async changeGoodsImageColor() {
    let color_id = this.ctx.request.body.color_id;
    const goods_image_id = this.ctx.request.body.goods_image_id;
    if (color_id) {
      color_id = this.app.mongoose.Types.ObjectId(color_id);
    }
    const result = await this.ctx.model.GoodsImage.updateOne({ _id: goods_image_id }, {
      color_id,
    });
    // console.log(result)
    if (result.n == 1 && result.nModified == 1 && result.ok == 1) {
      this.ctx.body = { success: true, message: '更新数据成功' };
    } else {
      this.ctx.body = { success: false, message: '更新数据失败' };
    }
  }
  async goodsImageRemove() {
  // 注意:图片是否删掉 如果删除fs模块删除对应当前数据的图片
    const goods_image_id = this.ctx.request.body.goods_image_id;
    const result = await this.ctx.model.GoodsImage.deleteOne({ _id: goods_image_id });
    if (result.ok == 1) {
      this.ctx.body = { success: true, message: '删除数据成功' };
    } else {
      this.ctx.body = { success: true, message: '删除数据失败' };
    }
  }
}

module.exports = GoodsController;
