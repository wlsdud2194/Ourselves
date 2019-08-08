const os = require('os');

exports.getServerIp = () => {
  const ifaces = os.networkInterfaces();
  let serverIp = null;

  Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip 127.0.0.1
        return;
      }
  
      serverIp = iface.address;
    });
  });

  return serverIp;
};