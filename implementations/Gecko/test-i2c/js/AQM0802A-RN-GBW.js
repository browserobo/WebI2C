'use strict';

window.addEventListener('load', function (){
  function Sleep(millisec) {
    var start = new Date();
    while(new Date() - start < millisec);
  }

  navigator.requestI2CAccess().then(
    function(i2cAccess) {
      var port = i2cAccess.open(2);
      port.setDeviceAddress(0x3e);
      // init
      var LCD_CONTRAST = 100;
      Sleep(40);
      port.write8(0x00, 0x38);
      Sleep(1);
      port.write8(0x00, 0x39);
      Sleep(1);
      port.write8(0x00, 0x14);
      Sleep(1);
      port.write8(0x00, 0x70 | (LCD_CONTRAST & 0xF));
      Sleep(1);
      port.write8(0x00, 0x5c | ((LCD_CONTRAST >> 4) & 0x3));
      port.write8(0x00, 0x6c);
      Sleep(300);
      port.write8(0x00, 0x38);
      port.write8(0x00, 0x0c);
      port.write8(0x00, 0x01);
      port.write8(0x00, 0x06);
      Sleep(2);

      document.getElementById('contrast').addEventListener('change', function() {
        console.log(this.value);
        port.write8(0x00, 0x39);
        Sleep(1);
        port.write8(0x00, 0x70 | (this.value & 0x0f));
        Sleep(1);
        port.write8(0x00, 0x38);
      }, false);

      var row0 = document.getElementById('row0');
      var row1 = document.getElementById('row1');
      var submitButton = document.getElementById('submitButton');
      submitButton.addEventListener('click', function (){
        var i;

        port.write8(0x00, 0x80 | 0x00);
        for (i = 0; i < row0.value.length; i++) {
          port.write8(0x40, row0.value.charCodeAt(i));
        }

        port.write8(0x00, 0x80 | 0x40);
        for (i = 0; i < row1.value.length; i++) {
          port.write8(0x40, row1.value.charCodeAt(i));
        }
      }, false);
    },
    function(error) {
      console.log(error.message);
    }
  );
}, false);
