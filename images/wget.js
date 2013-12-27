
var exec = require('child_process').exec;

for(var i = 0; i < 77; i++){ 
  var h = Math.round(40+Math.random()*1000)
    , w = Math.round(40+Math.random()*1000);
  exec( "wget -O cat-" +w+"x"+h+ ".jpg http://placekitten.com/" + w + "/"+ h); 
}