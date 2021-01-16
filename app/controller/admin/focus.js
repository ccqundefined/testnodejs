'use strict';

const BaseController = require('./base');
/*
1.安装mz-modules
*/
const pump = require('mz-modules/pump');
const path = require('path');
const fs = require('fs');

class FocusController extends BaseController {
  async index() {
    //   获取轮播图数据
    const result = await this.ctx.model.Focus.find({});
    await this.ctx.render('admin/focus/index', {
      list: result,
    });
  }
  //   注意:上传文件必须在所有其他的 fields 后面，否则在拿到文件流时可能还获取不到 fields。
  async doSingleUpload() {
    //   单文件上传
    const stream = await this.ctx.getFileStream(); // 获取表单提交的数据
    // console.log(stream)
    // 表单提交的其他数据
    const fields = stream.fields;
    // 上传的目录 注意目录要存在   path.basename xxx/yyy/dsads.jpg => dsads.jpg
    const target = 'app/public/admin/upload/' + path.basename(stream.filename);
    const writeStrem = fs.createWriteStream(target);
    // 也可以这样用，但是不建议，因为一旦写入失败有可能造成卡死
    // await stream.pipe(writeStrem)
    await pump(stream, writeStrem);
    this.ctx.body = {
      url: target,
      fields: stream.fields,
    };
  }
  async multi() {
    await this.ctx.render('admin/focus/multi');
  }
  //   多个图片/文件
  async doMultiUpload() {
    const parts = await this.ctx.multipart({ autoFields: true });
    console.log(parts);
    const files = [];
    let stream;
    //   等待parts返回数据
    while ((stream = await parts()) != null) {
      console.log(stream);
      if (!stream.filename) { // 注意:如果没有传入图片直接返回
        return;
      }
      const filename = stream.filename.toLowerCase();
      const fieldname = stream.fieldname;
      const target = 'app/public/admin/upload/' + path.basename(filename);
      const writeStream = fs.createWriteStream(target);
      // 一个文件写入以后要记得销毁上一个文件流 不然浏览器卡死
      await pump(stream, writeStream); // egg demo提供的
      files.push({
        [fieldname]: target, // 属性名表达式
      });
    }
    this.ctx.body = { // 放到while循环后面
      files,
      fields: parts.field, // 所有表单字段都能通过'parts.fields' 获取到
    };
  }
  // 增加轮播图
  async addFocus() {
    await this.ctx.render('admin/focus/add');
  }
  async doAdd() {
    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    // 存储进数据库对象
    const saveData = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;
      // 上传图片的目录
      const dir = await this.ctx.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }
    const focus = new this.ctx.model.Focus(Object.assign(saveData, files, parts.field));
    try {
      await focus.save();
      await this.success('/admin/focus', '增加轮播图成功');
    } catch (error) {
      throw error;
    }
  }
  async edit() {
    const id = this.ctx.request.query.id;
    const result = await this.ctx.model.Focus.find({ _id: id });
    console.log(result);
    await this.ctx.render('admin/focus/edit', {
      list: result[0],
    });
  }
  async doEdit() {
    const parts = this.ctx.multipart({ autoFields: true });
    let files = {};
    // 存储进数据库对象
    const saveData = {};
    let stream;
    while ((stream = await parts()) != null) {
      if (!stream.filename) {
        break;
      }
      const fieldname = stream.fieldname;
      // 上传图片的目录
      const dir = await this.ctx.service.tools.getUploadFile(stream.filename);
      const target = dir.uploadDir;
      const writeStream = fs.createWriteStream(target);
      await pump(stream, writeStream);
      files = Object.assign(files, {
        [fieldname]: dir.saveDir,
      });
    }
    // 修改操作
    const id = parts.field.id;
    const updateResult = Object.assign(saveData, files, parts.field);
    try {
      await this.ctx.model.Focus.updateOne({ _id: id }, updateResult);
      await this.success('/admin/focus', '修改轮播图成功');
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FocusController;
