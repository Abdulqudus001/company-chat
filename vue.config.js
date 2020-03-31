const host = '0.0.0.0';
const port = 8080;
module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  devServer: {
    port,
    host,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
};
