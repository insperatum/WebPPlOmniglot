var Canvas = require('canvas');
var fs = require('fs');

var bmpBuffer = fs.readFileSync("/home/lbh/Data/omniglot/32x32/1.bmp");
// var bmpBuffer = fs.readFileSync("/home/lbh/Downloads/googlelogo.png");
// console.log(bmpBuffer);


var canvas = new Canvas(32, 32)
var ctx=canvas.getContext("2d");

var img = new Canvas.Image();
img.src = bmpBuffer
ctx.drawImage(img, 0, 0)

// img.onload = function() {
//   console.log("Loaded!")
// //   var canvas = new Canvas(img.width, img.height);
// //   var ctx = canvas.getContext('2d');
// //   ctx.drawImage(img, 0, 0, img.width / 4, img.height / 4);
// //   fs.writeFileSync("foo.bmp", canvas.toBuffer());
// }

// img.src = "/home/lbh/Data/omniglot/32x32/1.bmp";

console.log(canvas)


// while(true) {  }

// return null;