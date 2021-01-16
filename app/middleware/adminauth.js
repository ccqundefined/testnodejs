const { options } = require('svg-captcha');
const url = require('url');

module.exports = options => {
  return async (ctx, next) => {
    // console.log('adminauth')
    // 做admin权限判断
    /*
        1. 用户没有登录，跳转到登录页面
        2. 只有登录以后才可以访问后台管理系统
        */
    ctx.state.csrf = ctx.csrf; // 设置一个全局变量
    ctx.state.prevPage = ctx.request.headers.referer; // 保存上一页跳转的页面地址
    const pathname = url.parse(ctx.request.url).pathname;
    if (ctx.session.userinfo) { /* 表示已经登录*/
      ctx.state.userinfo = ctx.session.userinfo;
      const hasAuth = await ctx.service.admin.checkAuth();
      if (hasAuth) {
        //  获取权限列表
        if (ctx.state.userinfo.is_super == 1) {
          ctx.state.asideList = await ctx.service.admin.getAuthList(ctx.session.userinfo.role_id);
        } else {
          ctx.state.asideList = await ctx.service.admin.getAuthList(ctx.session.userinfo.role_id);
        }
        await next();
      } else {
        ctx.body = '您没有权限访问当前地址';
      }
    } else {
      //    排除不需要做权限判断的页面
      if (pathname === '/admin/login' || pathname === '/admin/doLogin' || pathname === '/admin/verify' || pathname === '/admin/changeStatus') {
        await next();
      } else {
        ctx.redirect('/admin/login');
      }
    }
  };
};
