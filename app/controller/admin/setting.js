'use strict';

const BaseController = require('./base.js');
const fs = require('fs');
const path = require('path');
const pump = require('mz-modules/pump');

class SettingController extends BaseController {
  async index() {
    // 提前给setting增加一条数据
    const result = await this.ctx.model.Setting.find({});
    if (result.length == 1) {
      await this.ctx.render('admin/setting/index', {
        list: result[0],
      });
    } else {
      this.ctx.status = 503;
      this.ctx.message = 'server error';
    }
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
    const updateResult = Object.assign(files, parts.field);
    console.log(updateResult);
    // console.log(this.ctx.request.body)
    await this.ctx.model.Setting.updateOne({}, updateResult);
    await this.success('/admin/setting', '修改系统设置成功成功');
  }
}

module.exports = SettingController;
