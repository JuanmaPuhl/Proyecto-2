var shaderProgramBLinnPhong  = null;
var shaderProgramCookTorrance = null;
var shaderProgramOrenNayar = null;
var shaderProgramCookTorranceShirley = null;

/*Funcion para setear uniforms de BlinnPhong*/
function setShaderBlinnPhong(){
  shaderProgram = shaderProgramBLinnPhong;
  posLocation = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_location = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  texLocation = gl.getAttribLocation(shaderProgram, 'vertexTextureCoordinates');
  u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrix = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_ka = gl.getUniformLocation(shaderProgram, 'ka');
  u_kd = gl.getUniformLocation(shaderProgram, 'kd');
  u_ks = gl.getUniformLocation(shaderProgram, 'ks');
  u_normalMatrix = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_coefEspec = gl.getUniformLocation(shaderProgram, 'coefEspec');
  u_MV = gl.getUniformLocation(shaderProgram, 'MV');
  u_sampler = gl.getUniformLocation(shaderProgram, 'imagen');
}

/*Funcion para setear uniforms de CookTorrance*/
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
  u_MV = gl.getUniformLocation(shaderProgram, 'MV');
  u_F0 = gl.getUniformLocation(shaderProgram,'F0');
  u_rugosidad = gl.getUniformLocation(shaderProgram,'rugosidad');
  u_ro = gl.getUniformLocation(shaderProgram,'p');
  u_sigma = gl.getUniformLocation(shaderProgram, 'sigma');
}

/*Funcion para setear uniforms de OrenNayar*/
function setShaderOrenNayar(){
  shaderProgram = shaderProgramOrenNayar;
  posLocation = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_location = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrix = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_ka = gl.getUniformLocation(shaderProgram, 'ka');
  u_kd = gl.getUniformLocation(shaderProgram, 'kd');
  u_ks = gl.getUniformLocation(shaderProgram, 'ks');
  u_normalMatrix = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_ro = gl.getUniformLocation(shaderProgram,'p');
  u_sigma = gl.getUniformLocation(shaderProgram, 'sigma');
  u_MV = gl.getUniformLocation(shaderProgram, 'MV');
}

/*Funcion para setear uniforms de Shirley*/
function setShaderCookTorranceShirley(){
  shaderProgram = shaderProgramCookTorranceShirley;
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
  u_MV = gl.getUniformLocation(shaderProgram, 'MV');
  u_rugosidad = gl.getUniformLocation(shaderProgram,'rugosidad');
  u_F0 = gl.getUniformLocation(shaderProgram,'F0');
  u_Nu= gl.getUniformLocation(shaderProgram, 'Nu');
  u_Nv = gl.getUniformLocation(shaderProgram, 'Nv');
}

/*Funcion para crear cada shaderProgram*/
function createShaderPrograms(){
  shaderProgramBLinnPhong = ShaderProgramHelper.create(VS_BlinnPhong_spot, FS_BlinnPhong_spot);
  shaderProgramCookTorrance =  ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
  shaderProgramOrenNayar = ShaderProgramHelper.create(VS_OrenNayar,FS_OrenNayar);
  shaderProgramCookTorranceShirley = ShaderProgramHelper.create(VS_CookTorranceShirley, FS_CookTorranceShirley);
}
