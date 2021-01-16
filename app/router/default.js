module.exports = app => {
  const { router, controller } = app;
  // 配置路由中间件
  const initMiddleware = app.middleware.init({}, app);
  router.get('/', initMiddleware, controller.default.index.index);
  router.get('/plist', initMiddleware, controller.default.product.list);
  router.get('/pinfo', initMiddleware, controller.default.product.info);
  router.get('/cart', initMiddleware, controller.default.flow.cart);
  router.get('/getImageList',initMiddleware,controller.default.product.getImageList);
  // 用户中心
  router.get('/login', initMiddleware, controller.default.user.login);
  router.get('/register', initMiddleware, controller.default.user.register);
  router.get('/user', initMiddleware, controller.default.user.welcome);
  router.get('/user/order', initMiddleware, controller.default.user.order);
};
