function Generate(){
  this.generateNoise = function(map){
    for(i = 0; i < h; i++){ //loop through rows
      for(j = 0; j < w; j++){ //loop through columns
        map[i][j] = noise(i,j); //produce nouse for each element in map
      }//end j loop
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
    var grassArr = [];
    var mountainArr = [];
    var waterArr = [];

    for(i = 0; i < h; i++){
      for(j = 0; j < w; j++){

        //Grass placement
        if(map[i][j] > .33 && map[i][j] <= .66){
          var Grass = new PIXI.extras.TilingSprite(grass, tile_width, tile_height);
          Grass.position.y = i*tile_height;
          Grass.position.x = j*tile_width;
          var x = [j,i];
          grassArr.push(x);
          stage.addChild(Grass);
        }
        //mountain placement
        else if(map[i][j] > .66 && map[i][j] <= 1){
          var mountain = new PIXI.extras.TilingSprite(mountainTexture, tile_width, tile_height);
          mountain.position.y = i*tile_height;
          mountain.position.x = j*tile_width;
          var x = [j,i];
          mountainArr.push(x);
          stage.addChild(mountain);
        }
        //water placement
        else if(map[i][j] >= 0 && map[i][j] <= .33 || map[i][j] > 1){ // >1 for when Noise detail above .5
          var water = new PIXI.extras.TilingSprite(waterTexture, tile_width, tile_height);
          water.position.y = i*tile_height;
          water.position.x = j*tile_width;
          var x = [j,i];
          waterArr.push(x);
          stage.addChild(water);
        }
      }
    }
    console.log(h*w, "tiles");
    console.log(grassArr.length, "grass tiles", grassArr);
    console.log(mountainArr.length, "mountain tiles", mountainArr);
    console.log(waterArr.length, "water tiles", waterArr);
  }
}
