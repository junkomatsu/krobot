var spawn = require('child_process').spawn
  , request = require('request')
  , fs = require('fs');

/**
 * Control Display (Linux frame buffer) by fim (framebuffer image viewer improve) command
 */
function Display() {
  // initialize
  this.avatar_url = undefined;
  this.avatar_filename = undefined;
  this.index = 0;
  this.string = 'ktkr';
  this.fim = undefined;
}

/**
 * Class definition
 */

Display.prototype = {

  display : function(filename) {
    console.log(filename);
    if(this.fim != undefined) { this.fim.kill(); this.fim = undefined; }
    this.fim = spawn('fim', ['-a', filename]);
  }, 

  displaySemaphore : function(char) {
    var semaphore_filename = __dirname + '/resources/semaphore/' + char.charAt(0).toLowerCase() + '.jpg';
    this.display(semaphore_filename);
  },

  setAvatar : function(url) {
    var self = this;
    request({ uri: url, encoding: 'binary'}, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var filename = new Date().getTime();
        fs.writeFile("/tmp/" + filename, body, 'binary', function(err) {
          if (err) {
            console.log(err);
          } else {
            this.avatar_url = url;
            this.avatar_filename = "/tmp/" + filename;
            console.log("URL : " + url + " write to /tmp/" + filename);
            self.display(this.avatar_filename);
            self.startAnimation();
          }
        });
      }
    })
  },

  setStringForAnimation : function(string) {
    this.string = string;
  },

  startAnimation : function() {
    this.timerId = setInterval(this.animationLoop, 2000, this);
  },

  stopAnimation : function() {
    clearInterval(this.timerId);
  },

  animationLoop : function(self) {
    console.log('animation loop');
    self.displaySemaphore(self.string.charAt(self.index++ % self.string.length));
  }
};

module.exports = Display;
