class Light{

  //Tanto lightPosition como intensity son vec3
  //intensity[0]=intensidad ambiente;
  //intensity[1]=intensidad difusa;
  //intensity[2]=intensidad especular;
  constructor(lightPosition,intensity,angle,direction){
        this.lightPosition = lightPosition;
        this.intensity = intensity;
        this.angle = angle;
        this.direction = direction;
        this.enabled = true;
  }

  setIntensity(intensity){
    this.intensity = intensity;
  }

  setDirection(direction){
    this.direction = direction;
  }

  setLightPosition(position){
    this.lightPosition = position;
  }
  //Retorno la posicion de la luz
  getLightPosition(){
    if(this.enabled)
    return this.lightPosition;
    else {
      return [0.0,0.0,0.0];
    }
  }

  getDirection(){
    if(this.enabled)
      return this.direction;
    else {
      return [0.0,0.0,0.0];
    }
  }
  //Retorno la intensidad de la luz
  getIntensity(){
    if(this.enabled)
      return this.intensity;
      else {
        return [[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0]];
      }
  }

  //Retorno el Angulo de la luz
  getAngle(){
    if(this.enabled)
    return this.angle;
    else {
      return [0.0,0.0,0.0];
    }
  }

  isEnabled(){
    return this.enabled;
  }

  enable(){
    this.enabled = true;
  }

  disable(){
    this.enabled = false;
  }

}
