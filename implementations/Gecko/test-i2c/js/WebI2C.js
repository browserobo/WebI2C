'use strict';

navigator.requestI2CAccess = function() {
  return new Promise(function(resolve, reject) {
    if (navigator.mozI2c) {
      var i2cAccess = new I2CAccess()
      resolve(i2cAccess);
    } else {
      reject({'message':'mozI2c not supported'});
    }
  });
}

function I2CAccess() {
}

I2CAccess.prototype = {
  open: function(portNumber) {
    navigator.mozI2c.open(portNumber);

    return new I2CPort(portNumber);
  }
};

function I2CPort(portNumber) {
  this.init(portNumber);
}

I2CPort.prototype = {
  init: function(portNumber) {
    this.portNumber = portNumber;
  },

  setDeviceAddress: function(deviceAddress) {
    this.deviceAddress = deviceAddress;
    navigator.mozI2c.setDeviceAddress(this.portNumber, this.deviceAddress);
  },

  read8: function(command, isOctet) {
    return new Promise(function(resolve, reject) {
      resolve(navigator.mozI2c.read(this.portNumber, command, true));
    }.bind(this));
  },

  read16: function(command, isOctet) {
    return new Promise(function(resolve, reject) {
      resolve(navigator.mozI2c.read(this.portNumber, command, false));
    }.bind(this));
  },

  write8: function(command, value) {
    return new Promise(function(resolve, reject) {
      navigator.mozI2c.write(this.portNumber, command, value, true);
      resolve(value);
    }.bind(this));
  },

  write16: function(command, value) {
    return new Promise(function(resolve, reject) {
      navigator.mozI2c.write(this.portNumber, command, value, false);
      resolve(value);
    }.bind(this));
  }
};

