'use strict';
const BaseController = require('./base');
const fs = require('fs');
const pump = require('mz-modules/pump');


class ArticleController extends BaseController {
  async index() {
    const page = this.ctx.request.query.page || 1;
    const pageSize = 2;
    const totalNum = await this.ctx.model.Article.find({}).count();
    const articleResult = await this.ctx.model.Article.aggregate([
      {
        $lookup: {
          from: 'article_cate',
          localField: 'cate_id',
          foreignField: '_id',
          as: 'cate_list',
        },
      },
      {
        $skip: (page - 1) * pageSize,
      },
      {
        $limit: pageSize,
      },
    ]);
    // console.log(articleResult)
    // let result = await this.ctx.model.Article.find({});
    // console.log(result);
    // 获取分类数据
    // console.log(totalNum)
    await this.ctx.render('admin/article/index', {
      list: articleResult,
      totalPages: Math.ceil(totalNum / pageSize),
      page,
    });
  }
  async add() {
    // 获取所有的分类
    const cateResult = await this.ctx.model.ArticleCate.aggregate([
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

    await this.ctx.render('admin/article/add', {
      cateList: cateResult,
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

    const article = new this.ctx.model.Article(Object.assign(files, parts.field));
    // console.log(article)
    await article.save();
    await this.success('/admin/article', '增加文章成功');
  }
  async edit() {
    const id = this.ctx.request.query.id;
    // 当前id对应的数据
    const result = await this.ctx.model.Article.find({ _id: id });
    // 获取所有的分类
    const cateList = await this.ctx.model.ArticleCate.aggregate([
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
    await this.ctx.render('admin/article/edit', {
      list: result[0],
      cateList,
      prevPage: this.ctx.state.prevPage,
    });
  }
  async doEdit() {
    const parts = this.ctx.multipart({ autoFields: true });
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
    const id = parts.field.id;
    const prevPage = parts.field.prevPage;
    const article = await this.ctx.model.Article.updateOne({ _id: id }, Object.assign(files, parts.field));
    // console.log(parts.field.id)
    await this.success(prevPage, '修改文章成功');
  }
}

module.exports = ArticleController;
