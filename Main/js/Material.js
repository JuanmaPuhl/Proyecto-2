class Material{

  constructor(type,name,ka,kd,ks,shininess,F0,rugosidad){
    this.type = type;
    this.name = name;
    this.ka = ka;
    this.kd = kd;
    this.ks = ks;
    this.shininess = shininess;
    this.F0=F0;
    this.rugosidad=rugosidad;
  }

  getName(){
    return this.name;
  }

  getKa(){
    return this.ka;
  }

  getKd(){
    return this.kd;
  }

  getKs(){
    return this.ks;
  }

  getShininess(){
    return this.shininess;
  }

  getType(){
    return this.type;
  }

  getF0(){
    return this.F0;
  }

  getRugosidad(){
    return this.rugosidad;
  }
}
