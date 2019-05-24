class Car {

  constructor(name){
    this.name = name;
    this.objects = [];
    this.colors = [];
    this.parsedOBJ = [];
    this.textures = [];
    this.scale = [1,1,1];
    this.traslation = [0,0,0];
    this.rotation = 0;
  }

  setScale(scale){
    this.scale = scale;
  }

  setTraslation(traslation){
    this.traslation = traslation;
  }

  setRotation(rotation){
    this.rotation = rotation;
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

  getTraslation(){
    return this.traslation;
  }

  getRotation(){
    return this.rotation;
  }

  getScale(){
    return this.scale;
  }

  getName(){
    return this.name;
  }
}
