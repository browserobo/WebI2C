// webI2C
// 
// WebI2C*1 Wrapper for mozI2c
// 1:https://rawgit.com/browserobo/WebI2C/master/index.html
// 
// Original code: Masashi Honma
// Align current spec: Satoru Takagi

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
  _open: function(portNumber) {
    navigator.mozI2c.open(portNumber);

    return new I2CPort(portNumber);
  } , 
  open: function(portNumber) {
    return new Promise( function(resolve, reject){
      navigator.mozI2c.open(portNumber);
      resolve (new I2CPort(portNumber));
    }.bind(this));
  } , 
  // Propery, it shoud be return the result of 'i2cdetect -l'
  ports: {0:0, 1:1, 2:2 , 3:4 } ,
  unexportAll: function(){
    console.log("not yet supported....")
  }
};

function I2CPort(portNumber) {
  this.init(portNumber);
}

I2CPort.prototype = {
  init: function(portNumber) {
    this.portNumber = portNumber;
    this.usedDeviceCount = 0;
    this.usedDevices = new Array();
  },
  
  _open: function(deviceAddress){
    if ( this.usedDevices[deviceAddress]){
      // open error
      return (null);
    } else {
      ++ this.usedDeviceCount;
      this.usedDevices[deviceAddress]= new I2CSlaveDevice(deviceAddress, this.portNumber);
      return (this.usedDevices[deviceAddress]);
    }
  },
  
  open: function(deviceAddress){
    var self = this;
    return new Promise(function(resolve,reject){
      if ( self.usedDevices[deviceAddress]){
        // open error
        reject(null);
        return ;
      } else {
        ++ self.usedDeviceCount;
        self.usedDevices[deviceAddress]= new I2CSlaveDevice(deviceAddress, this.portNumber);
        resolve(self.usedDevices[deviceAddress]);
      }
      
    }.bind(this));
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

function I2CSlaveDevice(deviceAddress, portNumber){
  this.init(deviceAddress , portNumber);  
}

I2CSlaveDevice.prototype = {
  init: function(deviceAddress , portNumber){
    this.deviceAddress = deviceAddress;
    this.portNumber = portNumber;
  },
  
  close: function(){
    console.log("currently do nothing..");
  },
  
  read8: function(command, isOctet) {
    return new Promise(function(resolve, reject) {
//      console.log("R: port:"+this.portNumber+ " device"+this.deviceAddress+": reg:"+command);
      navigator.mozI2c.setDeviceAddress(this.portNumber, this.deviceAddress);
      resolve(navigator.mozI2c.read(this.portNumber, command, true));
    }.bind(this));
  },

  read16: function(command, isOctet) {
    return new Promise(function(resolve, reject) {
      navigator.mozI2c.setDeviceAddress(this.portNumber, this.deviceAddress);
      resolve(navigator.mozI2c.read(this.portNumber, command, false));
    }.bind(this));
  },

  write8: function(command, value) {
    return new Promise(function(resolve, reject) {
//      console.log("W: port:"+this.portNumber+ " device"+this.deviceAddress+": reg:"+command + " :val:"+value);
      navigator.mozI2c.setDeviceAddress(this.portNumber, this.deviceAddress);
      navigator.mozI2c.write(this.portNumber, command, value, true);
      resolve(value);
    }.bind(this));
  },

  write16: function(command, value) {
    return new Promise(function(resolve, reject) {
      navigator.mozI2c.setDeviceAddress(this.portNumber, this.deviceAddress);
      navigator.mozI2c.write(this.portNumber, command, value, false);
      resolve(value);
    }.bind(this));
  }  
}
