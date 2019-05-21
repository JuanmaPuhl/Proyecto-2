
/*Funcion que dicta que materiales se dibujan con cada modelo*/
function drawObject(object){
	if(object.getMaterial().getType()=="Metal"){
    drawCookTorrance(object);
	}
	if(object.getMaterial().getType()=="Plastic"){
		drawOrenNayar(object);
	}
	if(object.getMaterial().getType()=="Glass"){
    drawCookTorrance(object);
	}
  if(object.getMaterial().getType()=="Satin"){
    drawCookTorranceShirley(object);
  }
}

/*Funcion que pasa a los shaders los parametros de la camara*/
function passCamera(){
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);
}

/*Funcion que pasa a los shaders los parametros de cada luz*/
function passLight(index,light){
	//Hecho lo mas general posible
	//Creo un string para cada variable y la asocio con un parametro en el shader
	//Posicion
	let str = "lights["+(index-1)+"].posL";
	let u_posL = gl.getUniformLocation(shaderProgram,str);
	//Direccion
	str = "lights["+(index-1)+"].dirL";
	let u_dirL = gl.getUniformLocation(shaderProgram,str);
	//Intensidad o color
	str = "lights["+(index-1)+"].ia";
	let u_ia = gl.getUniformLocation(shaderProgram,str);
	//Angulo (Solo usado si es spot)
	str = "lights["+(index-1)+"].limit";
	let u_limit = gl.getUniformLocation(shaderProgram,str);
	//Tipo. (Como de todas formas tengo que poner ifs en los shader mejor le
	//paso esto y listo)
	str = "lights["+(index-1)+"].type";
	let u_type = gl.getUniformLocation(shaderProgram,str);
	//Comienzo a transformar a coord. vista y pasar los parametros
	//Transformo la posicion
	let spot_position_eye = vec4.create();
	vec4.transformMat4(spot_position_eye,light.getLightPosition(),viewMatrix);
	gl.uniform4fv(u_posL, spot_position_eye);//La paso
	//Color y angulo
	gl.uniform3fv(u_ia, light.getIntensity()[0]);
	gl.uniform1f(u_limit, light.getAngle());
	//Direccion
	let spot_direction_eye = vec4.create();
	vec4.transformMat4(spot_direction_eye,light.getDirection(),viewMatrix);
	gl.uniform4fv(u_dirL, spot_direction_eye);
	//Tipo
	gl.uniform1i(u_type, light.getType());
}

/*En las siguientes funciones se sigue el mismo procedimiento,
Se setea el shaderProgram, se pasan las luces asi como el resto de uniforms*/

/*Funcion para dibujar con Blinn Phong*/
function drawBlinnPhong(object){
  setShaderBlinnPhong();
  gl.useProgram(shaderProgram);
  passLight(1,light);
	passLight(2,light2);
	passLight(3,light3);
  passCamera();
  let matrix = object.getObjectMatrix();
  gl.uniformMatrix4fv(u_modelMatrix, false, matrix);
  let MV = mat4.create();
  mat4.multiply(MV , viewMatrix , matrix);
  gl.uniformMatrix4fv(u_MV, false, MV);
  mat4.invert(MV,MV);
  mat4.transpose(MV,MV);
  gl.uniformMatrix4fv(u_normalMatrix, false, MV);
  let material = object.getMaterial();
  /*-----------------------PASO LOS VALORES DEL MATERIAL--------------------*/
  gl.uniform3fv(u_ka,material.getKa());
  gl.uniform3fv(u_kd,material.getKd());
  gl.uniform3fv(u_ks,material.getKs());
  gl.uniform1f(u_coefEspec,material.getShininess());
  gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
  gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);
  gl.bindVertexArray(null);
  gl.useProgram(null);
}

/*Funcion para dibujar con Cook Torrance*/
function drawCookTorrance(object){
  setShaderCookTorrance();
  gl.useProgram(shaderProgram);
  passCamera();
	passLight(1,light);
	passLight(2,light2);
	passLight(3,light3);
  let matrix = object.getObjectMatrix();
  gl.uniformMatrix4fv(u_modelMatrix, false, matrix);
  let MV = mat4.create();
  mat4.multiply(MV , viewMatrix , matrix);
  gl.uniformMatrix4fv(u_MV, false, MV);
  mat4.invert(MV,MV);
  mat4.transpose(MV,MV);
  gl.uniformMatrix4fv(u_normalMatrix, false, MV);
  let material = object.getMaterial();
  /*-----------------------PASO LOS VALORES DEL MATERIAL--------------------*/
  gl.uniform3fv(u_ka,material.getKa());
  gl.uniform3fv(u_kd,material.getKd());
  gl.uniform3fv(u_ks,material.getKs());
  gl.uniform1f(u_coefEspec,material.getShininess());
	gl.uniform1f(u_F0,material.getF0());
	gl.uniform1f(u_rugosidad,material.getRugosidad());
	gl.uniform1f(u_ro,1.0);
	gl.uniform1f(u_sigma,90.0);
  gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
  gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);//Dibuja planeta
  gl.bindVertexArray(null);
  gl.useProgram(null);
}

/*Funcion para dibujar con Oren Nayar*/
function drawOrenNayar(object){
  setShaderOrenNayar();
  gl.useProgram(shaderProgram);
  passCamera();
	passLight(1,light);
	passLight(2,light2);
	passLight(3,light3);

  let matrix = object.getObjectMatrix();
  gl.uniformMatrix4fv(u_modelMatrix, false, matrix);
  let MV = mat4.create();
  mat4.multiply(MV , viewMatrix , matrix);
  gl.uniformMatrix4fv(u_MV, false, MV);
  mat4.invert(MV,MV);
  mat4.transpose(MV,MV);
  gl.uniformMatrix4fv(u_normalMatrix, false, MV);
  gl.uniform1f(u_ro,1.0);
  gl.uniform1f(u_sigma,90.0);
  let material = object.getMaterial();
  /*-----------------------PASO LOS VALORES DEL MATERIAL--------------------*/
  gl.uniform3fv(u_ka,material.getKa());
  gl.uniform3fv(u_kd,material.getKd());
  gl.uniform3fv(u_ks,material.getKs());
  gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
  gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);//Dibuja planeta
  gl.bindVertexArray(null);
  gl.useProgram(null);
}

/*Funcion para dibujar con Shirley*/
function drawCookTorranceShirley(object){
  setShaderCookTorranceShirley();
  gl.useProgram(shaderProgram);
  passCamera();
	passLight(1,light);
	passLight(2,light2);
	passLight(3,light3);

  let matrix = object.getObjectMatrix();
  gl.uniformMatrix4fv(u_modelMatrix, false, matrix);
  let MV = mat4.create();
  mat4.multiply(MV , viewMatrix , matrix);
  gl.uniformMatrix4fv(u_MV, false, MV);
  mat4.invert(MV,MV);
  mat4.transpose(MV,MV);
  gl.uniformMatrix4fv(u_normalMatrix, false, MV);
  gl.uniform1f(u_rugosidad,0.84);
  gl.uniform1f(u_F0,0.51);
  gl.uniform1f(u_Nu,2);
  gl.uniform1f(u_Nv,2);
  let material = object.getMaterial();
  /*-----------------------PASO LOS VALORES DEL MATERIAL--------------------*/
  gl.uniform3fv(u_ka,material.getKa());
  gl.uniform3fv(u_kd,material.getKd());
  gl.uniform3fv(u_ks,material.getKs());
  gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
  gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);//Dibuja planeta
  gl.bindVertexArray(null);
  gl.useProgram(null);
}
