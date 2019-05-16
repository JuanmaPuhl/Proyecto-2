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
    return this.lightPosition;
  }

  getDirection(){
    return this.direction;
  }
  //Retorno la intensidad de la luz
  getIntensity(){
    return this.intensity;
  }

  //Retorno el Angulo de la luz
  getAngle(){
    return this.angle;
  }


}
