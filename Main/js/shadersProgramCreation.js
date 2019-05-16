
function setShaderBlinnPhong(){
  shaderProgram = shaderProgramBLinnPhong;
  posLocation = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_location = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrix = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_ka = gl.getUniformLocation(shaderProgram, 'ka');
  u_kd = gl.getUniformLocation(shaderProgram, 'kd');
  u_ks = gl.getUniformLocation(shaderProgram, 'ks');
  u_normalMatrix = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_coefEspec = gl.getUniformLocation(shaderProgram, 'coefEspec');
  u_posL = gl.getUniformLocation(shaderProgram, 'posL');
  u_ia = gl.getUniformLocation(shaderProgram, 'ia');
  u_MV = gl.getUniformLocation(shaderProgram, 'MV');
  u_limit = gl.getUniformLocation(shaderProgram, 'limit');
  u_dirL = gl.getUniformLocation(shaderProgram,'dirL');
}

function setShaderCookTorrance(){
  shaderProgram = shaderProgramCookTorrance;
  posLocation = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_location = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrix = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_ka = gl.getUniformLocation(shaderProgram, 'ka');
  u_kd = gl.getUniformLocation(shaderProgram, 'kd');
  u_ks = gl.getUniformLocation(shaderProgram, 'ks');
  u_normalMatrix = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_coefEspec = gl.getUniformLocation(shaderProgram, 'coefEspec');
  u_posL = gl.getUniformLocation(shaderProgram, 'posL');
  u_ia = gl.getUniformLocation(shaderProgram, 'ia');
  //u_id = gl.getUniformLocation(shaderProgram, 'id');
  //u_is = gl.getUniformLocation(shaderProgram, 'is');
  u_MV = gl.getUniformLocation(shaderProgram, 'MV');
  u_dirL = gl.getUniformLocation(shaderProgram,'dirL');
}

function createShaderPrograms(){
  shaderProgramBLinnPhong = ShaderProgramHelper.create(VS_BlinnPhong_spot, FS_BlinnPhong_spot);
  shaderProgramCookTorrance =  ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
}
