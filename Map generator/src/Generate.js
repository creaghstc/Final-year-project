/**
*   TODO
*   select static points such depending on either hnoise value "height" or the terrain ie mountain for high. use this tile
*   as an influence hub for the surrounding tiles weather/humidity. assign have a probability factor of certain weather depending on distance
*   from the influence hub or north south position.
*
*   Change the type to a Texture object.
*
*   Make shortest distance function.
*
*/







function Generate(){
  var mapArr = [];
  var counter;

  function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++){
      var el = array[i];
      if(modeMap[el] == null)
          modeMap[el] = 1;
        else
          modeMap[el]++;
        if(modeMap[el] > maxCount){
          maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}



  function surroundingTiles(tile){
    counter = 0;
    var typeArr = [];
    var ResultArray = [];


    for(j = 0; j < mapArr.length; j++){ //loop over all tiles
      for(yDif = -tile_height; yDif < tile_height + 1; yDif += tile_height){ //surrounding tiles
        for(xDif = -tile_width; xDif < tile_width + 1; xDif += tile_width){ //surrounding tiles
          if(mapArr[j].y == tile.y + yDif && mapArr[j].x == tile.x + xDif){ //if the tiles are surrounding base tile
            tiletype = mapArr[j].type; //log base tile type
            typeArr.push(tiletype); //store surrounding tiles

            if(tiletype != tile.type){ //if surroubnding tile is not the base tile
              counter ++; //counter for different tiles
            }
          }
        }
      }
    }
    ResultArray.push(counter);
    ResultArray.push(typeArr); //get most common tile
    return ResultArray; //return most common tile and counter
  }


  function smooth(){
    for(i = 0; i < mapArr.length; i++){
      var answer = surroundingTiles(mapArr[i]);
      // console.log(answer);
      if(answer[0] > 6 ){
        mapArr[i].type = mode(answer[1]);
      }
    }
  }

  function placeTile(x,y,texture){
    var tile = new PIXI.extras.TilingSprite(texture, tile_height, tile_width);
    tile.position.x = x;
    tile.position.y = y;
    stage.addChild(tile);
  }
  this.generateNoise = function(map){
    var ycoord = 0;
    for(i = 0; i < h; i++){ //loop through rows
      var xcoord = 0;
      for(j = 0; j < w; j++){ //loop through columns
        xcoord += .2;
        if (i ==0 || j == 0 || i == h-1 || j == w-1){ //edges = 1
          map[i][j] = 1;
        }
        else{
          map[i][j] = noise(xcoord,ycoord); //produce nouse for each element in map
        }
      }//end j loop
      ycoord += .2;
    }//end i loop
  }//end function generateNoise

  //initialze a map at user specificatioins
  this.init2DMap = function (map, height, width){ //takes in array and relative dimensions
    map.length = height;
    for(i = 0; i < height; i++){
      map[i] = [];
      for(j = 0; j < width; j++){
        map[i][j] = random(0,1); //fill out map array
      }//end j loop
    }//end i loop
  }//end function init2DMap


  this.generateMap = function(map){
    //textures and arrays
    var grass = PIXI.Texture.fromImage('img/grass.png');
    var mountainTexture = PIXI.Texture.fromImage('img/brown.jpg');
    var waterTexture = PIXI.Texture.fromImage('img/blue.jpg');

    for(i = 0; i < h; i++){
      for(j = 0; j < w; j++){

        //Grass placement
        if(map[i][j] > .33 && map[i][j] <= .66){
          var x = new tile(j*tile_width, i*tile_height, "grass");
          mapArr.push(x);
        }
        //mountain placement
        else if(map[i][j] > .66 && map[i][j] <= 1){
          var x = new tile(j*tile_width, i*tile_height, "mountain");
          mapArr.push(x);
        }
        //water placement
        else if(map[i][j] >= 0 && map[i][j] <= .33 || map[i][j] > 1){ // >1 for when Noise detail above .5
          var x = new tile(j*tile_width, i*tile_height, "water");
          mapArr.push(x);
        }
      }
    }
    smooth();

    //this way allows me to edit the tile type before placing
    for(i = 0; i < mapArr.length; i++){
      if(mapArr[i].type == "grass"){
        placeTile(mapArr[i].x, mapArr[i].y, grass)
      }
      if(mapArr[i].type == "mountain"){
        placeTile(mapArr[i].x, mapArr[i].y, mountainTexture)
      }
      if(mapArr[i].type == "water"){
        placeTile(mapArr[i].x, mapArr[i].y, waterTexture)
      }
    }
    console.log(mapArr.length, "tiles", mapArr);

  }
}
