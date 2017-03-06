/**
*   TODO
*   select static points such depending on either hnoise value "height" or the terrain ie mountain for high. use this tile
*   as an influence hub for the surrounding tiles weather/humidity. assign have a probability factor of certain weather depending on distance
*   from the influence hub or north south position.
*
*   Change the type to a Texture object.
*
*
*/







function Generate(){
  var holdingArr = [];
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


  function sand(){ //using x as to not clash with loop in distanceTo()
    holdingArr = mapArr;


    for(i = 1; i < h-1; i++){
      for(j = 1; j < w-1; j++){
        var count = 0;

        var answer = surroundingTiles(mapArr[i][j]);
        for(p in answer[1]){
          if(answer[1][p] == "water"){
            count ++;
          }
        }
        if(mapArr[i][j].type != "water" && count != 0){
          holdingArr[i][j].type = "sand";
        }
      }
    }
    mapArr = holdingArr;

  }

  function surroundingTiles(tile){
    counter = 0;
    var typeArr = [];
    var ResultArray = [];


    typeArr.push(mapArr[tile.y][tile.x-1].type); //log base tile type

    typeArr.push(mapArr[tile.y][tile.x+1].type); //log base tile type

    typeArr.push(mapArr[tile.y+1][tile.x-1].type); //log base tile type

    typeArr.push(mapArr[tile.y+1][tile.x].type); //log base tile type

    typeArr.push(mapArr[tile.y+1][tile.x+1].type); //log base tile type

    typeArr.push(mapArr[tile.y-1][tile.x-1].type); //log base tile type

    typeArr.push(mapArr[tile.y-1][tile.x].type); //log base tile type

    typeArr.push(mapArr[tile.y-1][tile.x+1].type); //log base tile type

    for(var x = 0; x < typeArr.length; x++){
      if(typeArr[x] != tile.type){
        counter ++;
      }
    }

    ResultArray.push(counter);
    ResultArray.push(typeArr); //get most common tile

    return ResultArray; //return most common tile and counter

  }


  function smooth(){
    holdingArr = mapArr;


    for(i = 1; i < h-1; i++){
      for(j = 1; j < w-1; j++){
        var answer = surroundingTiles(mapArr[i][j]);
        // console.log(answer[0]);
        if(answer[0] >= 5){
          holdingArr[i][j].type = mode(answer[1]);
        }
      }
    }
    mapArr = holdingArr;
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
        xcoord += .08;
        if (i ==0 || j == 0 || i == h-1 || j == w-1){ //edges = 1
          map[i][j] = 1;
        }
        else{
          map[i][j] = noise(xcoord,ycoord); //produce nouse for each element in map

        }
      }//end j loop
      ycoord += .08;
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
    this.init2DMap(mapArr,h,w);
    var grass = PIXI.Texture.fromImage('img/grass.png');
    var mountainTexture = PIXI.Texture.fromImage('img/brown.jpg');
    var waterTexture = PIXI.Texture.fromImage('img/blue.jpg');
    var sandTexture = PIXI.Texture.fromImage("img/yellow.jpg");
    var FertilegrassTexture = PIXI.Texture.fromImage("img/fertilegrass1.png");
    var peakTexture = PIXI.Texture.fromImage("img/peak.png");

    for(i = 0; i < h; i++){
      for(j = 0; j < w; j++){

        //Grass placement
        if(map[i][j] > .4 && map[i][j] <= .6){
          var x = new tile(j*tile_width, i*tile_height, "grass", map[i][j]);
          mapArr[i][j] = x;
        }
        //mountain placement
        else if(map[i][j] > .6 && map[i][j] <= .8 || map[i][j] == 1){
          var x = new tile(j*tile_width, i*tile_height, "mountain", map[i][j]);
          mapArr[i][j] = x;
        }
        //water placement
        else if(map[i][j] >= 0 && map[i][j] <= .33 || map[i][j] > 1){ // >1 for when Noise detail above .5
          var x = new tile(j*tile_width, i*tile_height, "water", map[i][j]);
          mapArr[i][j] = x;
        }
        else if(map[i][j] < .4 && map[i][j] >= .33 ){ // >1 for when Noise detail above .5
            var x = new tile(j*tile_width, i*tile_height, "Fertilegrass", map[i][j]);
            mapArr[i][j] = x;
          }
        else if(map[i][j] >= .8 && map[i][j] < 1){ // >1 for when Noise detail above .5
            var x = new tile(j*tile_width, i*tile_height, "peak", map[i][j]);
            mapArr[i][j] = x;
          }
      }

    }
    smooth();
    console.log("smoothed");
    sand();
    console.log("sand'");
    // sand();


    //this way allows me to edit the tile type before placing
    for(i = 0; i < h; i++){
      for(j = 0; j <  w; j++){
        if(mapArr[i][j].type == "grass"){
          placeTile(mapArr[i][j].x*tile_width, mapArr[i][j].y*tile_width, grass);
        }
        else if(mapArr[i][j].type == "mountain"){
          placeTile(mapArr[i][j].x*tile_width, mapArr[i][j].y*tile_width, mountainTexture);
        }
        else if(mapArr[i][j].type == "water"){
          placeTile(mapArr[i][j].x*tile_width, mapArr[i][j].y*tile_width, waterTexture);
        }
        else if(mapArr[i][j].type == "sand"){
          placeTile(mapArr[i][j].x*tile_width, mapArr[i][j].y*tile_width, sandTexture);
        }
        else if(mapArr[i][j].type == "Fertilegrass"){
          placeTile(mapArr[i][j].x*tile_width, mapArr[i][j].y*tile_width, FertilegrassTexture);
        }
        else if(mapArr[i][j].type == "peak"){
          placeTile(mapArr[i][j].x*tile_width, mapArr[i][j].y*tile_width, peakTexture);
        }
      }
    }
    console.log(w*h, "tiles", mapArr);

  }
}
