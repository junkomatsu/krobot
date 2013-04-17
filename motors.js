var exec = require('child_process').exec;

/**
 * Control Motors
 */
function Motors() {
  // initialize
  exec('gpio -g mode 18 pwm');
  exec('gpio -g mode 22 out');
  exec('gpio -g mode 23 out');
  exec('gpio -g mode 24 out');
  exec('gpio -g mode 25 out');
}

/**
 * Class definition
 */

Motors.prototype = {
  go : function() {
    //console.log('Motors.go()');
    exec('gpio -g write 22 1');
    exec('gpio -g write 23 0');
    exec('gpio -g write 24 1');
    exec('gpio -g write 25 0');
  },

  left : function() {
    //console.log('Motors.left()');
    exec('gpio -g write 22 0');
    exec('gpio -g write 23 0');
    exec('gpio -g write 24 1');
    exec('gpio -g write 25 0');
  },

  right : function() {
    //console.log('Motors.right()');
    exec('gpio -g write 22 1');
    exec('gpio -g write 23 0');
    exec('gpio -g write 24 0');
    exec('gpio -g write 25 0');
  },

  back : function() {
    //console.log('Motors.back()');
    exec('gpio -g write 22 0');
    exec('gpio -g write 23 1');
    exec('gpio -g write 24 0');
    exec('gpio -g write 25 1');
  },

  stop : function() {
    //console.log('Motors.stop()');
    exec('gpio -g write 22 0');
    exec('gpio -g write 23 0');
    exec('gpio -g write 24 0');
    exec('gpio -g write 25 0');
  },

  pwm : function(duty) {
    exec('gpio -g pwm 18 ' + duty);
  }
};

module.exports = Motors;
