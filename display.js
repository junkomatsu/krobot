var exec = require('child_process').exec
  , request = require('request')
  , fs = require('fs');

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
  }, 

  display_url : function(url) {
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var filename = new Date().getTime();
        fs.writeFile("/tmp/" + filename, body, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("URL : " + url + " write to /tmp/" + filename);
            display("/tmp/" + filename);
          }
        });
      }
    })
  }
};

module.exports = Display;
