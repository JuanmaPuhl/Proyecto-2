

function drawObject(object){
	if(object.getMaterial().getType()=="Metal"){
    drawCookTorrance(object);
	}
	if(object.getMaterial().getType()=="Plastic"){
		drawCookTorrance(object);
	}
	if(object.getMaterial().getType()=="Glass"){
    drawCookTorrance(object);
	}
  if(object.getMaterial().getType()=="Satin"){
    drawCookTorrance(object);
  }
}

function passCamera(){
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);
}
function passLight1(light){
	let intensity = colorLuz();
	let intensity2 = [intensity,intensity,intensity];
	light.setIntensity(intensity2);
	//gl.uniform1f(u_ax,ax);
	//gl.uniform1f(u_ay,ay);
	let spot_position_eye = vec4.create();
	vec4.transformMat4(spot_position_eye,light.getLightPosition(),viewMatrix);
	gl.uniform4fv(u_posL, spot_position_eye);
	gl.uniform3fv(u_ia, light.getIntensity()[0]);
	//gl.uniform3fv(u_id, light.getIntensity()[1]);
	//gl.uniform3fv(u_is, light.getIntensity()[2]);
	gl.uniform1f(u_limit, light.getAngle());
	let spot_direction_eye = vec4.create();
	vec4.transformMat4(spot_direction_eye,light.getDirection(),viewMatrix);
	gl.uniform4fv(u_dirL, spot_direction_eye);
}

function passLight2(light){
	let intensity = colorLuz();
	let intensity2 = [intensity,intensity,intensity];
	light.setIntensity(intensity2);
	//gl.uniform1f(u_ax,ax);
	//gl.uniform1f(u_ay,ay);
	let spot_position_eye = vec4.create();
	vec4.transformMat4(spot_position_eye,light.getLightPosition(),viewMatrix);
	gl.uniform4fv(u_posL2, spot_position_eye);
	gl.uniform3fv(u_ia2, light.getIntensity()[0]);
	//gl.uniform3fv(u_id, light.getIntensity()[1]);
	//gl.uniform3fv(u_is, light.getIntensity()[2]);
	gl.uniform1f(u_limit2, light.getAngle());
	let spot_direction_eye = vec4.create();
	vec4.transformMat4(spot_direction_eye,light.getDirection(),viewMatrix);
	gl.uniform4fv(u_dirL2, spot_direction_eye);
}

function passLight3(light){
	let intensity = colorLuz();
	let intensity2 = [intensity,intensity,intensity];
	light.setIntensity(intensity2);
	//gl.uniform1f(u_ax,ax);
	//gl.uniform1f(u_ay,ay);
	let spot_position_eye = vec4.create();
	vec4.transformMat4(spot_position_eye,light.getLightPosition(),viewMatrix);
	gl.uniform4fv(u_posL3, spot_position_eye);
	gl.uniform3fv(u_ia3, light.getIntensity()[0]);
	//gl.uniform3fv(u_id, light.getIntensity()[1]);
	//gl.uniform3fv(u_is, light.getIntensity()[2]);
	gl.uniform1f(u_limit3, light.getAngle());
	let spot_direction_eye = vec4.create();
	vec4.transformMat4(spot_direction_eye,light.getDirection(),viewMatrix);
	gl.uniform4fv(u_dirL3, spot_direction_eye);
}


function drawBlinnPhong(object){
  setShaderBlinnPhong();
  gl.useProgram(shaderProgram);
  passLight1(light);
	passLight2(light2);
	passLight3(light3);
  passCamera();
  let matrix = object.getObjectMatrix();
  gl.uniformMatrix4fv(u_modelMatrix, false, matrix);
  let MV = mat4.create();
  mat4.multiply(MV , viewMatrix , matrix);
  gl.uniformMatrix4fv(u_MV, false, MV);
  mat4.invert(MV,MV);
  mat4.transpose(MV,MV);
  gl.uniformMatrix4fv(u_normalMatrix, false, MV);
  //gl.uniform1f(u_ro,1.0);
  //gl.uniform1f(u_sigma,90.0);
  let material = object.getMaterial();
  /*-----------------------PASO LOS VALORES DEL MATERIAL--------------------*/
  gl.uniform3fv(u_ka,material.getKa());
  gl.uniform3fv(u_kd,material.getKd());
  gl.uniform3fv(u_ks,material.getKs());
  //console.log(material.getKs());
  gl.uniform1f(u_coefEspec,material.getShininess());
  gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
  gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);//Dibuja planeta
  gl.bindVertexArray(null);
  gl.useProgram(null);
}

function drawCookTorrance(object){
  setShaderCookTorrance();
  gl.useProgram(shaderProgram);
  passCamera();
  passLight1(light);
  let matrix = object.getObjectMatrix();
  gl.uniformMatrix4fv(u_modelMatrix, false, matrix);
  let MV = mat4.create();
  mat4.multiply(MV , viewMatrix , matrix);
  gl.uniformMatrix4fv(u_MV, false, MV);
  mat4.invert(MV,MV);
  mat4.transpose(MV,MV);
  gl.uniformMatrix4fv(u_normalMatrix, false, MV);
  //gl.uniform1f(u_ro,1.0);
  //gl.uniform1f(u_sigma,90.0);
  let material = object.getMaterial();
  /*-----------------------PASO LOS VALORES DEL MATERIAL--------------------*/
  gl.uniform3fv(u_ka,material.getKa());
  gl.uniform3fv(u_kd,material.getKd());
  gl.uniform3fv(u_ks,material.getKs());
  //console.log(material.getKs());
  gl.uniform1f(u_coefEspec,material.getShininess());
	gl.uniform1f(u_F0,material.getF0());
	gl.uniform1f(u_rugosidad,material.getRugosidad());
	//console.log(material.getRugosidad());
	//gl.uniform1f(u_F0,3.81);
  //gl.uniform1f(u_rugosidad,0.3);
	gl.uniform1f(u_ro,1.0);
	gl.uniform1f(u_sigma,90.0);
  gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
  gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);//Dibuja planeta
  gl.bindVertexArray(null);
  gl.useProgram(null);
}

function drawOrenNayar(object){
  setShaderOrenNayar();
  gl.useProgram(shaderProgram);
  passCamera();
  passLight1(light)
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

function drawCookTorranceShirley(object){
  setShaderCookTorranceShirley();
  gl.useProgram(shaderProgram);
  passCamera();
  passLight1(light)
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
