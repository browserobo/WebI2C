var PCA9685 = {
  sleep: function(ms, generator) {
    setTimeout(function(){
      try {
        generator.next();
      } catch (e) {
        if (! (e instanceof StopIteration)) throw e;
      }
    }, ms);
  },
  init:function (port,address,noSetZero){
    this.PCA9685device = null;
    var self = this;
//    var device = port._open(address);
//    this.PCA9685device = device;
//    port.setDeviceAddress(address);
    
    return new Promise(function(resolve,reject){
      port.open(address).then(function(device){
        self.PCA9685device = device;
    console.log("init address:" + address + " : " , self.PCA9685device);
        var thread = (function* (){

  //        console.log(0x00,0x00);
          device.write8(0x00,0x00);
          yield self.sleep(10, thread);
  //        console.log(0x01,0x04);
          device.write8(0x01,0x04);
          yield self.sleep(10, thread);

  //        console.log(0x00,0x10);
          device.write8(0x00,0x10);
          yield self.sleep(10, thread);
  //        console.log(0xfe,0x64);
          device.write8(0xfe,0x64);
          yield self.sleep(10, thread);
  //        console.log(0x00,0x00);
          device.write8(0x00,0x00);
          yield self.sleep(10, thread);
  //        console.log(0x06,0x00);
          device.write8(0x06,0x00);
          yield self.sleep(10, thread);
  //        console.log(0x07,0x00);
          device.write8(0x07,0x00);
          yield self.sleep(300, thread);


          if ( !noSetZero ){
            for ( var servoPort = 0 ; servoPort < 16 ; servoPort ++ ){
              self.setServo(port , address,servoPort , 0 ).then(
                function(){
                  resolve();
                },
                function(){
                  reject();
                }
              );
            }
          }

        })();
        thread.next();
      });
    });
  },
  setServo:function (servoPort,angle){
//    console.log("setServo ");
    var self = this;
//    port.setDeviceAddress(address);
    
    var portStart = 8;
    var portInterval = 4;
    
    var center = 0.001500; // sec ( 1500 micro sec)
    var range  = 0.000600; // sec ( 600 micro sec) a bit large?
    var angleRange = 50.0;
    
    if ( angle > angleRange){
      angle = angleRange;
    } else if ( angle < -angleRange ){
      angle = - angleRange;
    }
        
    var freq = 61; // Hz
    var tickSec = ( 1 / freq ) / 4096; // 1bit resolution( sec )
    var centerTick = center / tickSec;
    var rangeTick = range / tickSec;
        
    var gain = rangeTick / angleRange; // [tick / angle]
        
    var ticks = Math.round(centerTick + gain * angle);
        
    var tickH = (( ticks >> 8 ) & 0x0f);
    var tickL = (ticks & 0xff);
    var device = this.PCA9685device;
//    console.log("device",device);
    return new Promise(function(resolve,reject){
      var thread = (function* (){
//        console.log( Math.round(portStart + servoPort * portInterval + 1), tickH);
        device.write8( Math.round(portStart + servoPort * portInterval + 1), tickH);
        yield self.sleep(1, thread);
//        console.log( Math.round(portStart + servoPort * portInterval), tickL);
        device.write8( Math.round(portStart + servoPort * portInterval), tickL);
        
        resolve();
      
      })();
      thread.next();
    });
  }
}

