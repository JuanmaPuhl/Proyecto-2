//Variables para los objetos
var gl = null;
var shaderProgram  = null; //Shader program to use.
var parsedOBJ = null;
var parsedOBJ2 = null;
//Uniform locations.
var u_modelMatrix;
var u_viewMatrix;
var u_projMatrix;
var u_ka;
var u_kd;
var u_ks;
var u_normalMatrix;
var u_coefEspec;
var u_posL;
var u_ia;
var u_id;
var u_is;
var u_MV;
var u_ax;
var u_ay;

//Uniform values.
var viewMatrix = mat4.create();
var projMatrix = mat4.create();

var angle = [];
//Variables para generar la camara esferica
var camaraEsferica;
var eye = [2, 2, 2];
var target = [0, 0, 0];
var up = [0, 1, 0];

//Guardo los sliders para resetear todo a sus posiciones iniciales
//Se cargaran cuando el usuario mueva algun slider
var slider=[];
//Variables de control
var changed = false; //Es true si algun valor fue cambiado desde el ultimo reset
var fullScreen = false;//Es true si esta en pantalla completa
var rotationAngle=[];
var animated = [];
var then = 0;
var rotationSpeed = 30;

//MATERIALES
var materials = [];

//OBJETOS
var balls = [];
var obj_axis;
//LUCES
var light;
var light_position = [0.0,10.0,10.0,1.0];
var light_intensity = [[0.01,0.01,0.01],[1.0,1.0,1.0],[1.0,1.0,1.0]];
var light_angle = 0.0;
var ax = 0.4;
var ay = 0.41;
/*Esta funcion se ejecuta al cargar la pagina. Carga todos los objetos para que luego sean dibujados, asi como los valores iniciales
de las variables a utilizar*/
function onLoad() {
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	//Cargo los objetos a la escena
	onModelLoad();
	cargarSliders();//Cargo los sliders
	//Creacion de MATERIALES
	crearMateriales();

	//Creo las variables que voy a pasar a los shaders
	shaderProgram = ShaderProgramHelper.create(vertexShaderSource, fragmentShaderSource);
	let posLocation = gl.getAttribLocation(shaderProgram, 'vertexPos');
	let vertexNormal_location = gl.getAttribLocation(shaderProgram, 'vertexNormal');
	u_modelMatrix = gl.getUniformLocation(shaderProgram, 'modelMatrix');
	u_viewMatrix = gl.getUniformLocation(shaderProgram, 'viewMatrix');
	u_projMatrix = gl.getUniformLocation(shaderProgram, 'projMatrix');
	u_ka = gl.getUniformLocation(shaderProgram, 'ka');
	u_kd = gl.getUniformLocation(shaderProgram, 'kd');
	u_ks = gl.getUniformLocation(shaderProgram, 'ks');
	u_normalMatrix = gl.getUniformLocation(shaderProgram, 'normalMatrix');
	u_coefEspec = gl.getUniformLocation(shaderProgram, 'coefEspec');
	u_posL = gl.getUniformLocation(shaderProgram, 'posL');
	u_ia = gl.getUniformLocation(shaderProgram, 'ia');
	u_id = gl.getUniformLocation(shaderProgram, 'id');
	u_is = gl.getUniformLocation(shaderProgram, 'is');
	u_MV = gl.getUniformLocation(shaderProgram, 'MV');
	u_ax = gl.getUniformLocation(shaderProgram, 'ax');
	u_ay = gl.getUniformLocation(shaderProgram, 'ay');


  obj_axis = new Object(parsedOBJ2);
  obj_axis.setMaterial(getMaterialByName("Jade"));
  obj_axis.setVao(VAOHelper.create(obj_axis.getIndices(), [
    new VertexAttributeInfo(obj_axis.getPositions(), posLocation, 3),
    new VertexAttributeInfo(obj_axis.getNormals(), vertexNormal_location, 3)
  ]));
	for(let i = 0; i<6; i++){ //Pelotas
    let arr = [];
      for(let j=0; j<4; j++){
        arr.push(new Object(parsedOBJ));
  			arr[j].setMaterial(getMaterialByIndex((i+j)%materials.length));
  			arr[j].setVao(VAOHelper.create(arr[j].getIndices(), [
  				new VertexAttributeInfo(arr[j].getPositions(), posLocation, 3),
  				new VertexAttributeInfo(arr[j].getNormals(), vertexNormal_location, 3)
  			]));
      }
    balls.push(arr);
    arr = [];
	}
	light = new Light(light_position , light_intensity , light_angle);//Creo la luz


	gl.clearColor(0.05, 0.05, 0.05, 1.0); //Cambio el color de fondo
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	/*Creacion de camara*/
	camaraEsferica= new sphericalCamera(glMatrix.toRadian(angle[4]),glMatrix.toRadian(angle[5]),3,target,up);
	viewMatrix=camaraEsferica.createViewMatrix();//Calculo la matriz de vista
	let fov = glMatrix.toRadian(angle[3]); //Establezco el campo de vision inicial
	let aspect = canvas.width / canvas.height;//Establezco la relacion de aspecto
	let near = 0.1;//Establezco la distancia minima que renderizare
	let far = 10.0;//Establezco la distancia maxima que renderizare
	projMatrix=camaraEsferica.createPerspectiveMatrix(fov,near,far,aspect);//Calculo la matriz de proyeccion

	gl.enable(gl.DEPTH_TEST);//Activo esta opcion para que dibuje segun la posicion en Z. Si hay dos fragmentos con las mismas x,y pero distinta zIndex
	//Dibujara los que esten mas cerca de la pantalla.
	requestAnimationFrame(onRender)//Pido que inicie la animacion ejecutando onRender
}

/*Este metodo se llama constantemente gracias al metodo requestAnimationFrame(). En los sliders no
se llama al onRender, sino que unicamente actualiza valores. Luego el onRender recupera esos valores y transforma
los objetos como corresponda.*/
function onRender(now){
	now *= 0.001; //Tiempo actual
	var deltaTime = now - then; //El tiempo que paso desde la ultima llamada al onRender y la actual
	then = now; //Actualizo el valor
	refreshAngles(deltaTime); //Actualizo los angulos teniendo en cuenta el desfasaje de tiempo
	/*Reinicio Matrices*/
	refreshFrame();

	/*Comienzo a preparar para dibujar*/
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.useProgram(shaderProgram);
	passLight(light);
	passCamera();

	//console.log(matriz);
	for(let i = 0; i<balls.length; i++){
    let arr = balls[i];
    for(let j = 0; j<arr.length; j++){
      arr[j].resetObjectMatrix();
      let matrix = arr[j].getObjectMatrix();
      let translationMatrix = mat4.create();
      let scaleMatrix = mat4.create();
      mat4.fromTranslation(translationMatrix,[-3 ,0,-12.5]);
      mat4.multiply(matrix,translationMatrix,matrix);
      translationMatrix = mat4.create();
      mat4.fromScaling(scaleMatrix,[0.08,0.08,0.08]);
      mat4.fromTranslation(translationMatrix,[2*j,0,5*i]);
      mat4.multiply(matrix,translationMatrix,matrix);
      mat4.multiply(matrix,scaleMatrix,matrix);
      drawObject(arr[j]);
    }
	}
  drawObject(obj_axis);
	gl.useProgram(null);
	requestAnimationFrame(onRender); //Continua el bucle
}

function refreshFrame(){

	/*Actualizo las transformaciones para cada uno de los objetos*/

	refreshCamera();
}

function refreshCamera(){
	if(animated[5]) //Si esta rotando automaticamente a la izquierda...
		viewMatrix = camaraEsferica.quaternionCamera(glMatrix.toRadian(rotationAngle[5]),glMatrix.toRadian(angle[4])); //Roto segun el angulo de rotacion 5
	else
		if(animated[6]) //Si esta rotando automaticamente a la derecha...
			viewMatrix = camaraEsferica.quaternionCamera(glMatrix.toRadian(rotationAngle[6]),glMatrix.toRadian(angle[4])); //Roto segun el angulo de rotacion 6
		else {// Si no esta siendo animada
			viewMatrix = camaraEsferica.quaternionCamera(glMatrix.toRadian(angle[4]),glMatrix.toRadian(angle[3])); //Roto segun el angulo del slider
		}
	projMatrix=camaraEsferica.zoom(angle[2]);//Vuelvo a calcular la matriz de proyeccion (Perspectiva)
}

function passCamera(){
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);
}

function passLight(light){
	//Algoritmo http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
	let temperature = angle[1]/100;
	let red;
	let green;
	let blue;
	//Calculate red
	if(temperature <= 66){
		red = 1;
	}
	else{
		red = temperature - 60;
		red = (329.698727446 * Math.pow(red,-0.1332047592))/255;
		if(red < 0)
			red = 0;
		if(red > 1)
			red = 1;
	}

	//Calculate Green
	if(temperature <= 66){
		green = temperature;
		green = (99.4708025861 * Math.log(green) - 161.1195681661)/255;
		if(green < 0)
			green = 0;
		if(green > 1)
			green = 1;
	}
	else{
		green = temperature - 60;
		green = (288.1221695283 * Math.pow(green,-0.0755148492))/255;
		if(green < 0)
			green = 0;
		if(green > 1)
			green = 1;
	}


	//Calculate blue
	if(temperature >= 66)
		blue = 1;
	else{
		if(temperature <= 19)
			blue = 0;
		else{
			blue = temperature - 10;
			blue = (138.5177312231 * Math.log(blue) - 305.0447927307)/255;
			if(blue < 0)
				blue = 0;
			if(blue > 1)
				blue = 1;
		}
	}
	let intensity = [red,green,blue];
	let intensity2 = [intensity,intensity,intensity];
	light.setIntensity(intensity2);

	gl.uniform4fv(u_posL, light.getLightPosition());
	gl.uniform3fv(u_ia, light.getIntensity()[0]);
	gl.uniform3fv(u_id, light.getIntensity()[1]);
	gl.uniform3fv(u_is, light.getIntensity()[2]);
}

function drawObject(object){
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
	gl.uniform4fv(u_ka,material.getKa());
	gl.uniform4fv(u_kd,material.getKd());
	gl.uniform4fv(u_ks,material.getKs());
	gl.uniform1f(u_coefEspec,material.getShininess());
	gl.uniform1f(u_ax,ax);
	gl.uniform1f(u_ay,ay);
	gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
	gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);//Dibuja planeta
	gl.bindVertexArray(null);
}
/*Funcion para refrescar los angulos de rotacion automatica*/
function refreshAngles(deltaTime){
	 // A partir del tiempo que pasó desde el ultimo frame (timeDelta), calculamos los cambios que tenemos que aplicar al cubo
	for(let x = 0; x<10 ; x++){
		if(animated[x]){
			if(x==6){ //Si lo que se esta animando es la camara rotando automaticamente de forma horaria
				rotationAngle[x] = deltaTime * (-rotationSpeed)+rotationAngle[x];
				if(rotationAngle[x]<=0)
					rotationAngle[x]=360;
			}
			else
			 if(x==5){//Si lo que estoy animando es la camara rotando automaticamente de forma antihoraria
				rotationAngle[x] = deltaTime * rotationSpeed + rotationAngle[x];
				if(rotationAngle[x]>360)
					rotationAngle[x]=0;
			}
			else{//Si no es ninguno de los casos anteriores establezco un angulo de rotacion estandar
				rotationAngle[x] = deltaTime * rotationSpeed + rotationAngle[x];
				if(rotationAngle[x]>360)
					rotationAngle[x]=-360;
			}
		}
	}
}

/*Funcion para cargar los objetos*/
function onModelLoad() {
	//parsedOBJ = OBJParser.parseFile(teapot);
	parsedOBJ = OBJParser.parseFile(ball);
  parsedOBJ2 = OBJParser.parseFile(axis);
}
