class Car {

  constructor(){
    this.objects = [];
    this.colors = [];
    this.parsedOBJ = [];
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
