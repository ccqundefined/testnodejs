class AppBoot {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    console.log('程序已启动');
  }

  async didLoad() {
    // 所有的配置已经加载完毕
    // 可以用来加载应用自定义的文件，启动自定义的服务

    console.log('配置已加载完毕');
  }

  async willReady() {
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用

    // 例如：从数据库加载数据到内存缓存
    console.log('插件已启动完毕');
  }

  async didReady() {
    // 应用已经启动完毕
    console.log('应用已启动完毕');
  }

  async serverDidReady() {
    // http / https server 已启动，开始接受外部请求
    // 此时可以从 app.server 拿到 server 的实例

    this.app.messenger.on('worker_init', data => {
      // ...
      console.log(data);
    });
  }
}

module.exports = AppBoot;
