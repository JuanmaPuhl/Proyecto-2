


var shaderProgramBLinnPhong  = null; //Shader program to use.
var shaderProgramCookTorrance = null;
var shaderProgramOrenNayar = null;
var shaderProgramCookTorranceShirley = null;


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
  u_MV = gl.getUniformLocation(shaderProgram, 'MV');

  u_limit = gl.getUniformLocation(shaderProgram, 'limit1');
  u_dirL = gl.getUniformLocation(shaderProgram,'dirL1');
  u_posL = gl.getUniformLocation(shaderProgram, 'posL1');
  u_ia = gl.getUniformLocation(shaderProgram, 'ia1');

  u_limit2 = gl.getUniformLocation(shaderProgram, 'limit2');
  u_dirL2 = gl.getUniformLocation(shaderProgram,'dirL2');
  u_posL2 = gl.getUniformLocation(shaderProgram, 'posL2');
  u_ia2 = gl.getUniformLocation(shaderProgram, 'ia2');

  u_limit3 = gl.getUniformLocation(shaderProgram, 'limit3');
  u_dirL3 = gl.getUniformLocation(shaderProgram,'dirL3');
  u_posL3 = gl.getUniformLocation(shaderProgram, 'posL3');
  u_ia3 = gl.getUniformLocation(shaderProgram, 'ia3');
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
  //u_id = gl.getUniformLocation(shaderProgram, 'id');
  //u_is = gl.getUniformLocation(shaderProgram, 'is');
  u_MV = gl.getUniformLocation(shaderProgram, 'MV');

  u_F0 = gl.getUniformLocation(shaderProgram,'F0');
  u_rugosidad = gl.getUniformLocation(shaderProgram,'rugosidad');
  u_ro = gl.getUniformLocation(shaderProgram,'p');
  u_sigma = gl.getUniformLocation(shaderProgram, 'sigma');


  u_posL = gl.getUniformLocation(shaderProgram, 'posL');
  u_dirL = gl.getUniformLocation(shaderProgram,'dirL');
  u_ia = gl.getUniformLocation(shaderProgram, 'ia');
  u_limit = gl.getUniformLocation(shaderProgram, 'limit');

  u_posL2 = gl.getUniformLocation(shaderProgram, 'posL2');
  u_dirL2 = gl.getUniformLocation(shaderProgram,'dirL2');
  u_ia2 = gl.getUniformLocation(shaderProgram, 'ia2');
  u_limit2 = gl.getUniformLocation(shaderProgram, 'limit2');

  u_posL3 = gl.getUniformLocation(shaderProgram, 'posL3');
  u_dirL3 = gl.getUniformLocation(shaderProgram,'dirL3');
  u_ia3 = gl.getUniformLocation(shaderProgram, 'ia3');
  u_limit3 = gl.getUniformLocation(shaderProgram, 'limit3');
}

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


  //u_id = gl.getUniformLocation(shaderProgram, 'id');
  //u_is = gl.getUniformLocation(shaderProgram, 'is');
  u_ro = gl.getUniformLocation(shaderProgram,'p');
  u_sigma = gl.getUniformLocation(shaderProgram, 'sigma');
  u_MV = gl.getUniformLocation(shaderProgram, 'MV');

  u_posL = gl.getUniformLocation(shaderProgram, 'posL');
  u_dirL = gl.getUniformLocation(shaderProgram,'dirL');
  u_ia = gl.getUniformLocation(shaderProgram, 'ia');
  u_limit = gl.getUniformLocation(shaderProgram, 'limit');

  u_posL2 = gl.getUniformLocation(shaderProgram, 'posL2');
  u_dirL2 = gl.getUniformLocation(shaderProgram,'dirL2');
  u_ia2 = gl.getUniformLocation(shaderProgram, 'ia2');
  u_limit2 = gl.getUniformLocation(shaderProgram, 'limit2');

  u_posL3 = gl.getUniformLocation(shaderProgram, 'posL3');
  u_dirL3 = gl.getUniformLocation(shaderProgram,'dirL3');
  u_ia3 = gl.getUniformLocation(shaderProgram, 'ia3');
  u_limit3 = gl.getUniformLocation(shaderProgram, 'limit3');
}

function setShaderCookTorranceShirley(){
  shaderProgram = shaderProgramCookTorranceShirley;
  posLocation = gl.getAttribLocation(shaderProgram, 'vertexPosition');
  vertexNormal_location = gl.getAttribLocation(shaderProgram, 'vertexNormal');
  u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
  u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
  u_projMatrix = gl.getUniformLocation(shaderProgram, 'projectionMatrix');
  u_ka = gl.getUniformLocation(shaderProgram, 'CoeficienteAmbiental');
  u_kd = gl.getUniformLocation(shaderProgram, 'CoeficienteDifuso');
  u_ks = gl.getUniformLocation(shaderProgram, 'CoeficienteEspecular');
  u_normalMatrix = gl.getUniformLocation(shaderProgram, 'normalMatrix');
  u_coefEspec = gl.getUniformLocation(shaderProgram, 'coefEspec');
  u_posL = gl.getUniformLocation(shaderProgram, 'posL');
  u_ia = gl.getUniformLocation(shaderProgram, 'ia');
  //u_id = gl.getUniformLocation(shaderProgram, 'id');
  //u_is = gl.getUniformLocation(shaderProgram, 'is');
  u_MV = gl.getUniformLocation(shaderProgram, 'MV');
  u_rugosidad = gl.getUniformLocation(shaderProgram,'rugosidad');
  u_F0 = gl.getUniformLocation(shaderProgram,'F0');
  u_Nu= gl.getUniformLocation(shaderProgram, 'Nu');
  u_Nv = gl.getUniformLocation(shaderProgram, 'Nv');
  //u_limit = gl.getUniformLocation(shaderProgram, 'limit');
  //u_dirL = gl.getUniformLocation(shaderProgram,'dirL');

}

function createShaderPrograms(){
  shaderProgramBLinnPhong = ShaderProgramHelper.create(VS_BlinnPhong_spot, FS_BlinnPhong_spot);
  shaderProgramCookTorrance =  ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
  shaderProgramOrenNayar = ShaderProgramHelper.create(VS_OrenNayar,FS_OrenNayar);
  //shaderProgramCookTorranceShirley = ShaderProgramHelper.create(VS_CookTorranceShirley, FS_CookTorranceShirley);
}
