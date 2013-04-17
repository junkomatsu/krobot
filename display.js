var exec = require('child_process').exec;

/**
 * Control Display (Linux frame buffer) by fim (framebuffer image viewer improve) command
 */
function Display() {
  // initialize
}

/**
 * Class definition
 */

Display.prototype = {

  display : function(filename) {
    exec('fim -a ' + filename);
  }

};

module.exports = Display;
