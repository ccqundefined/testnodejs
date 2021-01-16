'use strict';

const BaseController = require('./base.js');

class AccessController extends BaseController {
  async index() {
    // const result = await this.ctx.model.Access.find({});
    // console.log(result);

    // 1.在access表中找出 module_id=0的数据     管理员管理 权限管理 角色管理 (模块)
    // 2.让access表和access表关联  条件:找出access表中module_id等于_id的数据

    const result = await this.ctx.model.Access.aggregate([
      {
        $lookup: {
          from: 'access',
          localField: '_id',
          foreignField: 'module_id',
          as: 'items',
        },
      },
      {
        $match: {
          module_id: '0',
        },
      },
    ]);
    // console.log(JSON.stringify(result));
    await this.ctx.render('admin/access/index', {
      list: result,
    });
  }
  async add() {
    // 获取模块列表
    const result = await this.ctx.model.Access.find({ module_id: '0' });
    // console.log(result);
    await this.ctx.render('admin/access/add', {
      moduleList: result,
    });
  }
  async doAdd() {
    // console.log(this.ctx.request.body)
    // 获取module_id
    const addResult = this.ctx.request.body;
    const module_id = addResult.module_id;
    // 如果不等于0 是菜单或者操作执行
    if (module_id !== '0') {
      // 把字符串转换成objectid
      addResult.module_id = this.app.mongoose.Types.ObjectId(module_id);
    } else { // 0 模块

    }
    // 增加权限
    const access = new this.ctx.model.Access(addResult);
    await access.save();
    await this.success('/admin/access', '增加权限成功');
  }
  async edit() {
    const result = await this.ctx.model.Access.find({ module_id: '0' });
    const _id = this.ctx.request.query.id;
    // 获取编辑的数据
    const accessResult = await this.ctx.model.Access.find({ _id });
    await this.ctx.render('admin/access/edit', {
      list: accessResult[0],
      moduleList: result,
    });
  }
  async doEdit() {
    try {
      const data = this.ctx.request.body;
      // console.log(data);
      const id = data.id;
      if (data.module_id != 0) {

        // 注意:这里需要转换module_id
        data.module_id = this.app.mongoose.Types.ObjectId(data.module_id);
      }
      // 注意:因为Schema里面没有id和csrf所以会自动过滤掉，可以直接使用
      const result = await this.ctx.model.Access.updateOne({ _id: id }, { $set: data });
      if (result.n === 1) {
        await this.success('/admin/access', '修改权限成功');
      } else {
        await this.error('/admin/access', '修改权限失败');
      }
    } catch (e) {
      throw e;
    }
  }
  async delete() {
    await this.ctx.render('admin/access/index');
  }
}

module.exports = AccessController;
