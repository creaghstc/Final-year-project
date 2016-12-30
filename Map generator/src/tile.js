function tile(x, y, type){
  this.x = 0;
  this.y = 0;
  this.type = null;

  this.setX = function(value){
    this.x = value;
  }

  this.setY = function(value){
    this.y = value;
  }

  this.setType = function(value){
    this.type = value;
  }

  this.getType = function(){
    return this.type;
  }

}
