'use strict';

const BaseController = require('./base.js');

class RoleController extends BaseController {
  async index() {
    const result = await this.ctx.model.Role.find({});
    await this.ctx.render('admin/role/index', {
      list: result,
    });
  }
  async add() {
    await this.ctx.render('admin/role/add');
  }
  async doAdd() {
    // console.log(this.ctx.request.body)
    const data = this.ctx.request.body;
    const role = new this.ctx.model.Role({
      title: data.title,
      description: data.description,
    });
    const result = await role.save();
    await this.success('/admin/role', '增加角色成功');
  }
  async edit() {
    const id = this.ctx.query.id;
    const result = await this.ctx.model.Role.find({ _id: id });
    await this.ctx.render('admin/role/edit', {
      list: result[0],
    });
  }
  async doEdit() {
    // console.log(this.ctx.request.body)
    const _id = this.ctx.request.body._id;
    const title = this.ctx.request.body.title;
    const description = this.ctx.request.body.description;
    const result = await this.ctx.model.Role.updateOne({ _id }, {
      $set: {
        title,
        description,
      },
    });
    await this.success('/admin/role', '编辑角色成功');
  }
  async auth() {
    /*
        1.获取全部的权限
        2.查询当前角色拥有的权限(查询当前角色的权限id) 把查找到的数据放在数组中
        3.循环遍历所有的权限数据 判断当前权限是否在角色权限的数组中，如果在角色权限的数组中:选中 如果不在 不选中
        */
    const id = this.ctx.request.query.id;
    const result = await this.ctx.service.admin.getAuthList(id);
    console.log(result);
    await this.ctx.render('/admin/role/auth', {
      list: result,
      role_id: id,
    });
  }
  async doAuth() {
    const role_id = this.ctx.request.body.role_id;
    const access_node = this.ctx.request.body.access_node;
    // 删除原有的权限
    const result = await this.ctx.model.RoleAccess.deleteMany({ role_id: this.app.mongoose.Types.ObjectId(role_id) });
    for (let i = 0; i < access_node.length; i++) {
      const accessData = new this.ctx.model.RoleAccess({
        role_id: this.app.mongoose.Types.ObjectId(role_id),
        access_id: this.app.mongoose.Types.ObjectId(access_node[i]),
      });
      await accessData.save();
    }
    await this.success('/admin/role', '权限增加成功');
  }
  async delete() {
    await this.ctx.render('admin/role/index');
  }
}

module.exports = RoleController;
