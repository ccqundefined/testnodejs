'use strict';

const role = require('../../model/role.js');
const BaseController = require('./base.js');

class ManagerController extends BaseController {
  async index() {
    // 查询管理员表并关联角色表
    const result = await this.ctx.model.Admin.aggregate([
      {
        $lookup: {
          from: 'role',
          localField: 'role_id',
          foreignField: '_id',
          as: 'role',
        },
      },
    ]);
    // console.log(JSON.stringify(result));
    await this.ctx.render('admin/manager/index', {
      result,
    });
  }
  async add() {
    // 获取角色
    const roleResult = await this.ctx.model.Role.find({});
    await this.ctx.render('admin/manager/add', {
      roleResult,
    });
  }
  async doAdd() {
    // console.log(this.ctx.request.body);
    const addResult = this.ctx.request.body;
    addResult.password = await this.service.tools.md5(addResult.password);
    // 判断用户是否存在
    const adminResult = await this.ctx.model.Admin.find({ username: addResult.username });
    if (adminResult.length > 0) {
      await this.error('/admin/manager/add', '此管理员已存在');
    } else {
      // 因为schema里面没有定义csrf，所以在保存的时候会自动去掉此字段
      const admin = new this.ctx.model.Admin(addResult);
      await admin.save();
      await this.success('/admin/manager', '增加用户成功');
    }
  }
  async edit() {

    await this.ctx.render('admin/manager/edit');
  }
}

module.exports = ManagerController;
