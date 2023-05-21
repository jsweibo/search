const liveServer = require('live-server');
const path = require('path');

liveServer.start({
  root: path.resolve(__dirname, 'docs'),
  port: 80,
});
