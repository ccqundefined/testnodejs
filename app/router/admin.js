module.exports = app => {
  const { router, controller } = app;
  router.get('/admin', controller.admin.main.index);
  router.get('/admin/welcome', controller.admin.main.welcome);
  router.get('/admin/manager', controller.admin.manager.index);
  router.get('/admin/manager/add', controller.admin.manager.add);
  // 增加用户
  router.post('/admin/manager/doAdd', controller.admin.manager.doAdd);
  router.get('/admin/manager/edit', controller.admin.manager.edit);
  router.get('/admin/login', controller.admin.login.index);
  // 登录
  router.post('/admin/doLogin', controller.admin.login.doLogin);
  // 验证码
  router.get('/admin/verify', controller.admin.base.verify);
  // 退出登录
  router.get('/admin/loginOut', controller.admin.login.loginOut);
  // 改变状态
  router.get('/admin/changeStatus', controller.admin.base.changeStatus);


  router.get('/admin/role', controller.admin.role.index);
  router.get('/admin/role/add', controller.admin.role.add);
  // 增加角色
  router.post('/admin/role/doAdd', controller.admin.role.doAdd);
  router.get('/admin/role/edit', controller.admin.role.edit);
  // 编辑角色
  router.post('/admin/role/doEdit', controller.admin.role.doEdit);
  // 删除角色
  router.get('/admin/delete', controller.admin.base.delete);
  // 权限验证
  router.get('/admin/role/auth', controller.admin.role.auth);
  router.post('/admin/role/doAuth', controller.admin.role.doAuth);

  router.get('/admin/access', controller.admin.access.index);
  router.get('/admin/access/add', controller.admin.access.add);
  // 增加权限
  router.post('/admin/access/doAdd', controller.admin.access.doAdd);
  router.get('/admin/access/edit', controller.admin.access.edit);
  // 修改权限
  router.post('/admin/access/doEdit', controller.admin.access.doEdit);

  // 轮播图
  router.get('/admin/focus', controller.admin.focus.index);
  router.get('/admin/focus/multi', controller.admin.focus.multi);
  router.post('/admin/focus/doSingleUpload', controller.admin.focus.doSingleUpload);
  router.post('/admin/focus/doMultiUpload', controller.admin.focus.doMultiUpload);
  // 增加轮播图
  router.get('/admin/focus/add', controller.admin.focus.addFocus);
  router.post('/admin/focus/doAdd', controller.admin.focus.doAdd);
  // 修改轮播图
  router.get('/admin/focus/edit', controller.admin.focus.edit);
  router.post('/admin/focus/doEdit', controller.admin.focus.doEdit);
  // 修改轮播图排序
  router.get('/admin/focus/editNum', controller.admin.base.editNum);

  // 商品类型
  router.get('/admin/goodsType', controller.admin.goodsType.index);
  router.get('/admin/goodsType/add', controller.admin.goodsType.add);
  router.post('/admin/goodsType/doAdd', controller.admin.goodsType.doAdd);
  router.get('/admin/goodsType/edit', controller.admin.goodsType.edit);
  router.post('/admin/goodsType/doEdit', controller.admin.goodsType.doEdit);
  router.get('/admin/goodsType/delete', controller.admin.base.delete);
  // 商品类型属性
  router.get('/admin/goodsTypeAttribute', controller.admin.goodsTypeAttribute.index);
  router.get('/admin/goodsTypeAttribute/add', controller.admin.goodsTypeAttribute.add);
  router.post('/admin/goodsTypeAttribute/doAdd', controller.admin.goodsTypeAttribute.doAdd);
  router.get('/admin/goodsTypeAttribute/edit', controller.admin.goodsTypeAttribute.edit);
  router.post('/admin/goodsTypeAttribute/doEdit', controller.admin.goodsTypeAttribute.doEdit);
  router.get('/admin/goodsTypeAttribute/delete', controller.admin.base.delete);

  // 商品分类
  router.get('/admin/goodsCate', controller.admin.goodsCate.index);
  router.get('/admin/goodsCate/add', controller.admin.goodsCate.add);
  router.get('/admin/goodsCate/delete', controller.admin.base.delete);
  router.post('/admin/goodsCate/doAdd', controller.admin.goodsCate.doAdd);
  router.get('/admin/goodsCate/edit', controller.admin.goodsCate.edit);
  router.post('/admin/goodsCate/doEdit', controller.admin.goodsCate.doEdit);

  // 商品
  router.get('/admin/goods', controller.admin.goods.index);
  router.get('/admin/goods/add', controller.admin.goods.add);
  router.post('/admin/goods/doAdd', controller.admin.goods.doAdd);
  router.get('/admin/goods/goodsTypeAttribute', controller.admin.goods.goodsTypeAttribute);
  router.post('/admin/goods/uploadImage', controller.admin.goods.uploadImage);
  router.post('/admin/goods/uploadPhoto', controller.admin.goods.uploadPhoto);

  // 修改商品
  router.get('/admin/goods/edit', controller.admin.goods.edit);
  router.post('/admin/goods/doEdit', controller.admin.goods.doEdit);
  // 相册图片关联颜色
  router.post('/admin/goods/changeGoodsImageColor', controller.admin.goods.changeGoodsImageColor);
  // 删除图片
  router.post('/admin/goods/changeGoodsImageRemove', controller.admin.goods.goodsImageRemove);
  // 导航模块
  router.get('/admin/nav', controller.admin.nav.index);
  router.get('/admin/nav/add', controller.admin.nav.add);
  router.get('/admin/nav/delete', controller.admin.base.delete);
  router.post('/admin/nav/doAdd', controller.admin.nav.doAdd);
  router.get('/admin/nav/edit', controller.admin.nav.edit);
  router.post('/admin/nav/doEdit', controller.admin.nav.doEdit);
  //  文章分类
  router.get('/admin/articleCate', controller.admin.articleCate.index);
  router.get('/admin/articleCate/add', controller.admin.articleCate.add);
  router.get('/admin/articleCate/delete', controller.admin.base.delete);
  router.post('/admin/articleCate/doAdd', controller.admin.articleCate.doAdd);
  router.get('/admin/articleCate/edit', controller.admin.articleCate.edit);
  router.post('/admin/articleCate/doEdit', controller.admin.articleCate.doEdit);
  // 文章模块
  router.get('/admin/article', controller.admin.article.index);
  router.get('/admin/article/add', controller.admin.article.add);
  router.get('/admin/article/delete', controller.admin.base.delete);
  router.post('/admin/article/doAdd', controller.admin.article.doAdd);
  router.get('/admin/article/edit', controller.admin.article.edit);
  router.post('/admin/article/doEdit', controller.admin.article.doEdit);
  //  系统设置
  router.get('/admin/setting', controller.admin.setting.index);
  router.post('/admin/setting/doEdit', controller.admin.setting.doEdit);
};
