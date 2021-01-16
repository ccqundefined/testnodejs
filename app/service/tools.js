'use strict';

const Service = require('egg').Service;
const svgCaptcha = require('svg-captcha'); // 引入验证码
const md5 = require('md5'); // 引入md5
const sd = require('silly-datetime');
const path = require('path');
const mkdirp = require('mz-modules/mkdirp');
const Jimp = require('jimp');


class ToolsService extends Service {
  // 生成验证码
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 40,
      width: 80,
      height: 33,
      ignoreChars: '0o1i', // 验证码字符中排除这些字段
      color: true,
      background: '#cc9966',
    });
    return captcha;
  }
  // md5加密
  async md5(str) {
    return md5(str);
  }
  async getTime() {
    const d = new Date();
    return d.getTime();
  }
  async getUploadFile(filename) {
    // 1.获取当前日期
    const day = sd.format(new Date(), 'YYYYMMDD');
    // console.log(day);
    // 2.创建图片保存路径
    const dir = path.join(this.config.uploadDir, day);
    // console.log(dir);
    await mkdirp(dir);
    const d = await this.getTime(); /* 毫秒数 */
    // 返回图片保存的路径
    const uploadDir = path.join(dir, d + path.extname(filename));
    // console.log({
    //   uploadDir: uploadDir,
    //   saveDir: uploadDir.slice(3).replace(/\\/g,'/')
    // });
    return {
      uploadDir,
      saveDir: uploadDir.slice(3).replace(/\\/g, '/'),
    };
  }
  // 生成缩略图的模块
  async jimpImg(target) {
    Jimp.read(target, (err, lenna) => {
      if (err) throw err;
      for (let i = 0; i < this.config.jimpSize.length; i++) {
        const w = this.config.jimpSize[i].width;
        const h = this.config.jimpSize[i].height;
        lenna
          .resize(w, h) // resize
          .quality(60) // 设置图片质量最高100
        // .greyscale() // 设置图片灰度，不需要
          .write(target + '_' + w + 'x' + h + path.extname(target)); // save
      }
    });
  }
}

module.exports = ToolsService;
