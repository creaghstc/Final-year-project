
function Generate(){
  var holdingArr = [];
  var mapArr = [];
  var counter;
  var previousRiver = [];
  var peaks = [];
  var waterArr = [];
  var isWaterSeeded = false;

  function mode(array){
    var modeMap = {};
    var maxElement = array[0];
    var maxCount = 1;

    for(var i = 0; i < array.length; i++){
      var element = array[i];
      if(modeMap[element] == null)
          modeMap[element] = 1;
        else
          modeMap[element]++;
        if(modeMap[element] > maxCount){
          maxElement = element;
            maxCount = modeMap[element];
        }
    }
    return maxElement;
	}


  function sand(){
    holdingArr = mapArr;

    for(i = 1; i < h-1; i++){
      for(j = 1; j < w-1; j++){
        var waterPresent = false;
        var answer = surroundingTiles(mapArr[i][j]);

        for(p in answer[1]){
          if(answer[1][p] == "water"){
            waterPresent = true;
          }
        }

        if(mapArr[i][j].type != "water" && waterPresent == true){
          holdingArr[i][j].type = "sand";
        }
      }
    }
    mapArr = holdingArr;
  }

  function surroundingTiles(tile){
    var counter = 0;
    var typeArr = [];
    var ResultArray = [];
    var surrounding = [];
    var waterdist = [];

    for(x = -1; x < 2; x++){
      for(y = -1; y < 2; y++){
        if(x == 0 && y == 0){}
        else{
          typeArr.push(mapArr[tile.y+y][tile.x+x].type); //log base tile type
          surrounding.push(mapArr[tile.y+y][tile.x+x]);
        }
      }
    }

    for(x in typeArr){
      if(typeArr[x] != tile.type){
        counter ++;
      }
    }

    for(x in surrounding){
      if(surrounding[x].distanceTowater == null){
      }
      else{
        waterdist.push(surrounding[x].distanceTowater);
      }
    }

    ResultArray.push(counter);
    ResultArray.push(typeArr); //get most common tile
    ResultArray.push(surrounding); //all surrounding tiles
    ResultArray.push(Math.min.apply(Math,waterdist));



    return ResultArray; //return most common tile and counter

  }


  function smooth(){
    holdingArr = mapArr;

    for(i = 1; i < h-1; i++){
      for(j = 1; j < w-1; j++){
        var answer = surroundingTiles(mapArr[i][j]);
        if(answer[0] >= 5){
          holdingArr[i][j].type = mode(answer[1]);
        }

      }
    }
    mapArr = holdingArr;
  }

  function river(tile){
    previousRiver.push(tile); //add to previuos buffer
    var heights = [];
    var surrTiles = surroundingTiles(tile)[2]; //get array of surrounding tiles

    for(t in surrTiles){ //check if tile was used before
      for(x in previousRiver){
        if(previousRiver[x] != surrTiles[t] && surrTiles[t].noise < tile.noise){ //if not used
          heights.push(surrTiles[t].noise); //log its height
        }
      }
    }
    minimum = Math.min.apply(Math, heights) //get minimum height

    if(tile.type != "water"){ //if not already water
      //if already water the river has reached destination
      tile.type = "river"; //set to water
      for(t in surrTiles){
        if(surrTiles[t].noise == minimum){ //whichever tile matches minimum
          river(surrTiles[t]); //recurr
        }
      }
    }
  }
  function euclid(tileA, tileB){
    xdif = Math.pow(tileA.x-tileB.x,2);
    ydif = Math.pow(tileA.y-tileB.y,2);
    euclideanDistance = Math.pow(xdif+ydif, 0.5);

    return euclideanDistance;
  }

  function DistanceTowater(initialSeed){
    var hold = mapArr;
    for(var i = 1; i < h-1; i++){
      for(var j = 1; j < w-1; j++){

        if (initialSeed == false) {
          if(mapArr[i][j].type == "water"){
            hold[i][j].distanceTowater = 0;
          }
          else if(mapArr[i][j].distanceTowater == null && surroundingTiles(mapArr[i][j])[3] != Infinity){
            hold[i][j].distanceTowater = surroundingTiles(mapArr[i][j])[3] + 1;
          }
        }
        else{
          if(mapArr[i][j].type == "water"){
            hold[i][j].distanceTowater = 0;
          }
          else if(surroundingTiles(mapArr[i][j])[3] != Infinity){
            hold[i][j].distanceTowater = surroundingTiles(mapArr[i][j])[3] + 1;
          }
        }
      }
    }
    mapArr = hold;
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
    var treeTexture = PIXI.Texture.fromImage("img/tree.png");

    for(i = 0; i < h; i++){
      for(j = 0; j < w; j++){

        //Grass placement
        if(map[i][j] > .4 && map[i][j] <= .6){
          var x = new tile(j, i, "grass", map[i][j], null);
          mapArr[i][j] = x;
        }
        //mountain placement
        else if(map[i][j] > .6 && map[i][j] <= .8 || map[i][j] == 1){
          var x = new tile(j, i, "mountain", map[i][j], null);
          mapArr[i][j] = x;
        }
        //water placement
        else if(map[i][j] >= 0 && map[i][j] <= .33 || map[i][j] > 1){ // >1 for when Noise detail above .5
          var x = new tile(j, i, "water", map[i][j], null);
          mapArr[i][j] = x;
        }
        else if(map[i][j] < .4 && map[i][j] >= .33 ){ // >1 for when Noise detail above .5
            var x = new tile(j, i, "Fertilegrass", map[i][j], null);
            mapArr[i][j] = x;
          }
        else if(map[i][j] >= .8 && map[i][j] < 1){ // >1 for when Noise detail above .5
            var x = new tile(j, i, "peak", map[i][j], null);
            mapArr[i][j] = x;
            peaks.push(x);
          }
      }
    }

    for(p = 0; p< 16; p++){
      console.log(isWaterSeeded);
      DistanceTowater(isWaterSeeded);
      isWaterSeeded = true;

    }

    for(var call = 0; call < 3; call++){
      smooth();
    }

    
    for(var i = 1; i < h-1; i++){
      for(var j = 1; j < w-1; j++){
        if(mapArr[i][j].type == "river"){
          mapArr[i][j].type = "water";
        }
        else if(mapArr[i][j].type == "Fertilegrass" && mapArr[i][j].distanceTowater < 8 && mapArr[i][j].distanceTowater > 3){
          mapArr[i][j].type = "tree";
        }
        else if(mapArr[i][j].type == "grass" && mapArr[i][j].distanceTowater > 30 && mapArr[i][j].noise >.4){
          mapArr[i][j].type = "sand";
        }
      }
    }


    console.log("smoothed");
    sand();
    console.log("sand placed");
    for(p in peaks){
      if(p%8 == 0){ //cut down on number of rivers
        river(peaks[p]);
      }
    }
    console.log("rivers placed");

    console.log("distance to watered");












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
        else if(mapArr[i][j].type == "tree"){
          placeTile(mapArr[i][j].x*tile_width, mapArr[i][j].y*tile_width, treeTexture);

        }
      }
    }
    console.log(w*h, "tiles", mapArr);
    console.log("Map generated");

  }
}
