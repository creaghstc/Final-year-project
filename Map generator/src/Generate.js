function Generate(){
  function smooth(x,y){


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
    var mapArr = [];

    for(i = 0; i < h; i++){
      for(j = 0; j < w; j++){

        //Grass placement
        if(map[i][j] > .33 && map[i][j] <= .66){
          var x = new tile(j*tile_width, i*tile_height, "grass", map[i][j]);
          mapArr.push(x);
        }
        //mountain placement
        else if(map[i][j] > .66 && map[i][j] <= 1){
          var x = new tile(j*tile_width, i*tile_height, "mountain", map[i][j]);
          mapArr.push(x);
        }
        //water placement
        else if(map[i][j] >= 0 && map[i][j] <= .33 || map[i][j] > 1){ // >1 for when Noise detail above .5
          var x = new tile(j*tile_width, i*tile_height, "water", map[i][j]);
          mapArr.push(x);
        }
      }
    }
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
    console.log(mapArr, "tiles");

    // console.log(grassArr.length, "grass tiles", grassArr);
    // console.log(mountainArr.length, "mountain tiles", mountainArr);
    // console.log(waterArr.length, "water tiles", waterArr);
  }
}
