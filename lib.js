;(function () {

  "use strict";

  // http://indiegamr.com/generate-repeatable-random-numbers-in-js/
  var randomSeed = 6;
  var Utils = {};


  Utils.random = function(max, min) {
    max = max || 1;
    min = min || 0;

    randomSeed = (randomSeed * 9301 + 49297) % 233280;
    var rnd = randomSeed / 233280.0;

    return min + rnd * (max - min);
  }

  Utils.extend = function(obj) {
    for(var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }

  Utils.shuffle = function(o) {
    for(var j, x, i = o.length; i; j = Math.floor(Utils.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  Utils.expectation = function(list){
    var l = list.length
      , sum = 0;
    for(var i = 0; i < l; i++){
      sum += list[i];
    }
    return sum / l;
  }

  Utils.variance = function(list){
    var l = list.length;

    var l = list.length
      , sum = 0
      , sqSum = 0;
    for(var i = 0; i < l; i++){
      sum += list[i];
      sqSum += list[i] * list[i];
    }
    return (sqSum - sum * sum / l) / l;
  }

  function Image(options) {
    Utils.extend(this, options);

    this.el = document.createElement('div');
    this.el.className = 'image-container';
    this.el.appendChild(this.img);
    this.aspectRatio = this.width / this.height;

  }

  Image.prototype.resize = function(w, h) {
    var scale = (w / h > this.width / this.height) ? w / this.width : h / this.height;

    var nw = this.width * scale
      , nh = this.height * scale
      , cost = w * (nh-h) + h * (nw - w);



    this.el.style.width  = w + 'px';
    this.el.style.height = h + 'px';

    this.img.style.width = nw + 'px';
    this.img.style.height = nh + 'px';
    this.img.style.marginLeft = (w - nw)/2 + 'px';
    this.img.style.marginTop = (h - nh)/2 + 'px';
  };



  var defaultOptions = {
    margin: 7,
    maxWidth: 500,
    minHeight: 150,
    random: true,
    shuffle: true,
    maxIterations: 100
  }  

  function ImageLayout(images, options) {


    options = this.options = Utils.extend(defaultOptions, options || {});

    
    if(!true){
      images.sort(function(a,b) {
        return (a.aspectRatio > b.aspectRatio) ? -1 : 1;
      });
    }


    var minCost;
    var bestCase;

    var costs = [];
    var vs = [];

    if(options.random){
      for(var i = 0; i < options.maxIterations; i++){
        var rows = this.rowsForImages(images);
        var c = this.cost(rows);
        costs.push(c);

        vs.push(Utils.variance(costs));

        if(!minCost || minCost > c){
          minCost = c;
          bestCase = rows;
        }

        Utils.shuffle(images);
      }
    }


    rows = bestCase;


    if(this.options.shuffle) {
      rows.forEach(function(row) {
        Utils.shuffle(row);
      });
      Utils.shuffle(rows);
    }


    for(var i = 0; i < rows.length; i++){
      var row = rows[i];
      var h = this.countHeight(row);
      for(var j = 0; j < row.length; j++){
        var obj = row[j];
        obj.resize(obj.aspectRatio * h, h);
        document.body.appendChild(obj.el);
        obj.el.style.marginBottom = (i != rows.length - 1 ? this.options.margin : 0)+'px';
        obj.el.style.marginRight = (j != row.length - 1 ? this.options.margin : 0)+'px';
      }
      document.body.appendChild(document.createElement("br"));
    }
  }


  ImageLayout.prototype.countHeight = function(row) {
    var w = this.options.maxWidth - (row.length - 1) * this.options.margin;
    var sum = 0;
    for(var i = 0; i < row.length; i++) {
      var obj = row[i];
      sum += obj.width / obj.height;
    }

    return w / sum;
  }

  ImageLayout.prototype.rowsForImages = function(images){
    var rows = [];
    var rowNumber = 0;
    for(var i = 0; i < images.length; i++){
      var obj = images[i];
      var row = rows[rowNumber] = rows[rowNumber] || [];
      row.push(obj);
      var h = this.countHeight(row);
      if(row.length != 1 && h <= this.options.minHeight) {
        row.pop();
        rowNumber++;
        row = rows[rowNumber] = rows[rowNumber] || [];
        row.push(obj);
      }
    }
    return rows;
  }


  ImageLayout.prototype.cost = function(rows){
    var heights = [];
    for(var i = 0; i < rows.length; i++){
      heights[i] = this.countHeight(rows[i]);
    }

    return Utils.variance(heights);
  }















  window.addEventListener('load', function() {

    randomSeed = Math.floor(Math.random()*10000);

    var images = ['images/cat-1004x847.jpg', 'images/cat-100x99.jpg', 'images/cat-1013x519.jpg', 'images/cat-1022x405.jpg', 'images/cat-1031x347.jpg', 'images/cat-111x905.jpg', 'images/cat-124x598.jpg', 'images/cat-136x659.jpg', 'images/cat-143x839.jpg', 'images/cat-144x861.jpg', 'images/cat-156x373.jpg', 'images/cat-163x828.jpg', 'images/cat-176x922.jpg', 'images/cat-202x753.jpg', 'images/cat-212x929.jpg', 'images/cat-215x733.jpg', 'images/cat-221x307.jpg', 'images/cat-224x734.jpg', 'images/cat-235x992.jpg', 'images/cat-247x837.jpg', 'images/cat-248x159.jpg', 'images/cat-272x286.jpg', 'images/cat-278x873.jpg', 'images/cat-291x829.jpg', 'images/cat-294x243.jpg', 'images/cat-304x513.jpg', 'images/cat-306x852.jpg', 'images/cat-344x927.jpg', 'images/cat-353x229.jpg', 'images/cat-355x632.jpg', 'images/cat-357x712.jpg', 'images/cat-385x808.jpg', 'images/cat-400x545.jpg', 'images/cat-400x987.jpg', 'images/cat-410x193.jpg', 'images/cat-410x555.jpg', 'images/cat-413x246.jpg', 'images/cat-423x879.jpg', 'images/cat-424x138.jpg', 'images/cat-429x244.jpg', 'images/cat-440x367.jpg', 'images/cat-44x840.jpg', 'images/cat-454x183.jpg', 'images/cat-454x755.jpg', 'images/cat-461x452.jpg', 'images/cat-464x299.jpg', 'images/cat-465x831.jpg', 'images/cat-467x288.jpg', 'images/cat-468x696.jpg', 'images/cat-470x594.jpg', 'images/cat-481x330.jpg', 'images/cat-495x297.jpg', 'images/cat-538x902.jpg', 'images/cat-564x951.jpg', 'images/cat-577x830.jpg', 'images/cat-578x736.jpg', 'images/cat-582x613.jpg', 'images/cat-589x739.jpg', 'images/cat-617x670.jpg', 'images/cat-641x770.jpg', 'images/cat-653x300.jpg', 'images/cat-673x744.jpg', 'images/cat-713x181.jpg', 'images/cat-718x775.jpg', 'images/cat-745x557.jpg', 'images/cat-748x585.jpg', 'images/cat-766x566.jpg', 'images/cat-773x250.jpg', 'images/cat-788x899.jpg', 'images/cat-819x72.jpg', 'images/cat-830x432.jpg', 'images/cat-881x411.jpg', 'images/cat-929x240.jpg', 'images/cat-933x605.jpg', 'images/cat-93x184.jpg', 'images/cat-960x94.jpg', 'images/cat-988x301.jpg'];


    images = images.map(function(src) {
      
      var img     = document.createElement('img')
        , matches = src.match(/([0-9]+)x([0-9]+)/)
        , width   = matches[1]
        , height  = matches[2];

      img.setAttribute('src', src);

      return new Image({
        img: img,
        width: width,
        height: height
      });
    });

    new ImageLayout(images);
  });
  
}).call(this);