var opt = require('adnn/opt');
var ad = require('adnn/ad')
var nn = require('adnn/nn')
var adcanvas = require('adcanvas')
var Tensor = require('adnn/tensor')


var c = adcanvas.init(ad, Tensor, nn);

var kernel = c.powKernel(5, -8);
// console.log(kernel)
var gaussianBlur = function(x) {
  return c.convolve(x, kernel)
}
var linewidth = 2



var empty = c.fill(30, 30, 0)
var obs = empty
// var obs = c.drawLine(empty, 1, 2, 7, 7, linewidth);
var obs = c.drawSpline(empty, [[0,4],[10,18],[18,10],[25,25]], linewidth);

// var obs = c.drawLine(obs, 0,4,10,18, linewidth);

// var obs = c.drawLine(obs, 0, 0, 0, 10, linewidth)
// var obs = c.drawLine(obs, 0, 10, 10, 20, linewidth)

c.saveImage(obs, "output/_obs.bmp", [255,0,0])
var obsBlurred = gaussianBlur(obs)
c.saveImage(obsBlurred, "output/_obsblurred.bmp", [255,0,0])

var sqdiff = function(x, y) {
  var diff = ad.tensor.sub(x, y)
  return ad.tensor.sumreduce(ad.tensor.mul(diff, diff))
}

var params = ad.params([8])
params.x.set([0], 10)
params.x.set([1], 5)
params.x.set([2], 5)
params.x.set([3], 20)
params.x.set([4], 7)
params.x.set([5], 20)
params.x.set([6], 20)
params.x.set([7], 20)


function renderParams() {
  var x1 = ad.tensorEntry(params, 0)
  var y1 = ad.tensorEntry(params, 1)
  var x2 = ad.tensorEntry(params, 2)
  var y2 = ad.tensorEntry(params, 3)
  var x3 = ad.tensorEntry(params, 4)
  var y3 = ad.tensorEntry(params, 5)
  var x4 = ad.tensorEntry(params, 6)
  var y4 = ad.tensorEntry(params, 7)
  
  return c.drawSpline(empty, [[x1, y1], [x2, y2], [x3, y3], [x4, y4]], linewidth)
  // return c.drawLine(empty, x1, y1, x2, y2, linewidth)
}
var counter=0;
function model() {

  var render = renderParams()
  var renderBlurred = gaussianBlur(render)
  var cost = ad.scalar.add(ad.scalar.mul(sqdiff(render, obs), 10), ad.scalar.mul(sqdiff(renderBlurred, obsBlurred), 10))
  
  // counter++
  if(counter % 20 === 0) {
    console.log(counter + ": ", params.x)
    // console.log(params)
    // console.log(params.x)
    // console.log(render.x)
    c.saveImage(render, "output/inferred_" + counter + ".bmp")
    c.saveImage(renderBlurred, "output/inferred_" + counter + "blurry.bmp")
  }
  counter ++
  
  // console.log(ad.value(params))
  return {
    loss: cost,
    parameters: params
  };
}

opt.adOptimize(400, {
  iterations: 10000,
  method: opt.adam({stepSize: 0.1, decayRate1: 0.9, decayRate2: 0.99})
});



// var render = renderParams()
// console.log(render)
'done'