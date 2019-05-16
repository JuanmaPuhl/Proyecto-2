


function drawBlinnPhong(object){
  setShaderBlinnPhong();
  gl.useProgram(shaderProgram);
  passLight1(light)
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
  passLight1(light)
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
