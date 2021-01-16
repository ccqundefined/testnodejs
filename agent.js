module.exports = agent => {
  agent.messenger.on('egg-ready', () => {
    const data = '我是agent线程发送的';
    agent.messenger.sendToApp('worker_init', data);
  });
};
