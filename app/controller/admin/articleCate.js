'use strict';
const BaseController = require('./base');
const fs = require('fs');
const pump = require('mz-modules/pump');


class ArticleCateController extends BaseController {
  async index() {
    const result = await this.ctx.model.ArticleCate.aggregate([
      {
        $lookup: {
          from: 'article_cate',
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
    // console.log(JSON.stringify(result));
    // 获取分类数据
    await this.ctx.render('admin/articleCate/index', {
      list: result,
    });
  }
  async add() {
    const cate = await this.ctx.model.ArticleCate.find({ pid: '0' });
    console.log(cate);
    await this.ctx.render('admin/articleCate/add', {
      cateList: cate,
    });
  }
  async doAdd() {
    const parts = this.ctx.multipart({ autoFields: true });
    // console.log(parts);
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
      // 上传图片成功以后生成缩略图 注意:文件名里面不能有*号
      await this.ctx.service.tools.jimpImg(target);
    }

    // 表示把字符串的分类id转换成objectid
    if (parts.field.pid != '0') {
      parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);
    }
    const goodsCate = new this.ctx.model.ArticleCate(Object.assign(files, parts.field));
    // console.log(goodsCate)
    await goodsCate.save();
    await this.success('/admin/articleCate', '增加分类成功');
  }
  async edit() {
    const id = this.ctx.request.query.id;
    const result = await this.ctx.model.ArticleCate.find({ _id: id });
    const cateList = await this.ctx.model.ArticleCate.find({ pid: '0' });
    await this.ctx.render('admin/articleCate/edit', {
      list: result[0],
      cateList,
    });
  }
  async doEdit() {
    const id = this.ctx.request.query.id;
    const parts = this.ctx.multipart({ autoFields: true });
    // console.log(parts);
    let files = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;
      const dir = await this.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
      // 上传图片成功以后生成缩略图 注意:文件名里面不能有*号
      await this.ctx.service.tools.jimpImg(target);
    }

    // 表示把字符串的分类id转换成objectid
    if (parts.field.pid != '0') {
      parts.field.pid = this.app.mongoose.Types.ObjectId(parts.field.pid);
    }
    const goodsCate = await this.ctx.model.ArticleCate.updateOne({ _id: id }, Object.assign(files, parts.field));
    // console.log(this.ctx.request.query)
    await this.success('/admin/articleCate', '修改分类成功');
  }
}

module.exports = ArticleCateController;
