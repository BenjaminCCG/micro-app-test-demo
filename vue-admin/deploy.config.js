module.exports = {
  projectName: 'vue3-template-cli',
  privateKey: 'C:\\Users\\Cc/.ssh/id_rsa',
  passphrase: '',
  readyTimeout: 20000,
  cluster: [],
  prod: {
    name: '生产环境',
    script: 'yarn build',
    host: '120.77.17.38',
    port: 22,
    username: 'root',
    password: 'ContainerT01',
    distPath: 'vue3-template-cli',
    webDir: '/usr/share/nginx/html/vue3-template-cli',
    bakDir: '',
    isRemoveRemoteFile: true,
    isRemoveLocalFile: true
  }
};
