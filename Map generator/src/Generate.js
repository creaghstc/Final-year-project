function Generate(){


  this.generateMap = function(map){

    for(i = 0; i < h; i++){
      for(j = 0; j < w; j++){
        //Grass placement
        if(map[i][j] >= 0 && map[i][j] < 0.4){
          var Grass = new PIXI.extras.TilingSprite(mountainTexture, tile_width, tile_height);
          Grass.position.y = i*tile_height;
          Grass.position.x = j*tile_width;
          stage.addChild(Grass);
        }

        else if(map[i][j] > .4 && map[i][j] < 1){
          var mountain = new PIXI.extras.TilingSprite(grass, tile_width, tile_height);
          mountain.position.y = i*tile_height;
          mountain.position.x = j*tile_width;
          stage.addChild(mountain);

        }
      }
    }
  }
}