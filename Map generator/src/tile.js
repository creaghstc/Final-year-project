function tile(x, y, type, noise){
  this.x = x;
  this.y = y;
  this.type = type;
  this.noise = noise;

  this.setType = function(value){
    this.type = value;
  }

  this.getType = function(){
    return this.type;
  }

}
