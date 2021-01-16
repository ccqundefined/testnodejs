const Subscription = require('egg').Subscription;
class UpdateCache extends Subscription {
  static get schedule() {
    return {
      interval: '5s',
      type: 'worker', // all指定所有的worker都需要执行 worker仅当前worker执行
      disable: true
    };
  }
  async subscribe() {
    const res = await this.ctx.curl('https://news.baidu.com');
    console.log(res);
  }
}
module.exports = UpdateCache;
