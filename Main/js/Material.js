class Material{

  constructor(type,name,ka,kd,ks,shininess){
    this.type = type;
    this.name = name;
    this.ka = ka;
    this.kd = kd;
    this.ks = ks;
    this.shininess = shininess;
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
}
