class Car {

  constructor(){
    this.objects = [];
    this.colors = [];
    this.parsedOBJ = [];
    this.textures = [];
  }

  setTextures(textures){
    this.textures = textures;
  }

  getTextures(){
    return this.textures;
  }
  addObject(object){
    this.objects.push(object);
  }

  setColors(colors){
    this.colors = colors;
  }

  setOBJ(obj){
    this.obj = obj;
  }

  getObjects(){
    return this.objects;
  }

  getColors(){
    return this.colors;
  }

  getOBJ(){
    return this.obj;
  }
}
