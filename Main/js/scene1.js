//Variables para los objetos
var gl = null;
var shaderProgram  = null; //Shader program to use.
var parsedOBJ = null;
var parsedOBJ2 = null;
var parsedOBJ3 = null;
var parsedOBJ10 = null;
var parsedOBJ11 = null;
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
var obj_piso;
var obj_ball;
var obj_ball2;
var obj_ball3;
//LUCES
var lights = [];
var light;


var light2;


var light3;

var enrejado ;
var fuego;
var texture;

var cameraMouseControls;
var cameraAnimated = false;
/*Esta funcion se ejecuta al cargar la pagina. Carga todos los objetos para que luego sean dibujados, asi como los valores iniciales
de las variables a utilizar*/
function onLoad() {
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	//Cargo los objetos a la escena
	onModelLoad();
	//cargarSliders();//Cargo los sliders
	//Creacion de MATERIALES
	crearMateriales();

	createShaderPrograms();
	setShaderBlinnPhong();
	initTexture();
	obj_ball = new Object(parsedOBJ10);
	obj_ball.setVao(VAOHelper.create(obj_ball.getIndices(),[
		new VertexAttributeInfo(obj_ball.getPositions(), posLocation, 3),
		new VertexAttributeInfo(obj_ball.getNormals(), vertexNormal_location, 3)
	]));
	obj_ball.setMaterial(getMaterialByName("Default"));

	obj_ball2 = new Object(parsedOBJ);
	obj_ball2.setVao(VAOHelper.create(obj_ball2.getIndices(),[
		new VertexAttributeInfo(obj_ball2.getPositions(), posLocation, 3),
		new VertexAttributeInfo(obj_ball2.getNormals(), vertexNormal_location, 3)
	]));
	obj_ball2.setMaterial(getMaterialByName("Default"));

	obj_ball3 = new Object(parsedOBJ11);
	obj_ball3.setVao(VAOHelper.create(obj_ball3.getIndices(),[
		new VertexAttributeInfo(obj_ball3.getPositions(), posLocation, 3),
		new VertexAttributeInfo(obj_ball3.getNormals(), vertexNormal_location, 3)
	]));
	obj_ball3.setMaterial(getMaterialByName("Default"));


	obj_piso = new Object(parsedOBJ3);
	obj_piso.setMaterial(getMaterialByName("Rock"));
	obj_piso.setVao(VAOHelper.create(obj_piso.getIndices(), [
    new VertexAttributeInfo(obj_piso.getPositions(), posLocation, 3),
    new VertexAttributeInfo(obj_piso.getNormals(), vertexNormal_location, 3)
  ]));

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
  			arr[j].setMaterial(getMaterialByIndex(i));
  			arr[j].setVao(VAOHelper.create(arr[j].getIndices(), [
  				new VertexAttributeInfo(arr[j].getPositions(), posLocation, 3),
  				new VertexAttributeInfo(arr[j].getNormals(), vertexNormal_location, 3),
					new VertexAttributeInfo(arr[j].getTextures(), texLocation,2)
  			]));
				arr[j].setTexture(texture);

      }
    balls.push(arr);
    arr = [];
	}

	createLights();
	loadLights();
	light = lights[0];
	light2 = lights[1];
	light3 = lights[2];
	gl.clearColor(0.05, 0.05, 0.05, 1.0); //Cambio el color de fondo
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	/*Creacion de camara*/
	//camaraEsferica= new sphericalCamera(glMatrix.toRadian(angle[4]),glMatrix.toRadian(angle[5]),3,target,up);
	camaraEsferica = new sphericalCamera();
	// viewMatrix=camaraEsferica.createViewMatrix();//Calculo la matriz de vista
	// let fov = glMatrix.toRadian(angle[3]); //Establezco el campo de vision inicial
	// let aspect = canvas.width / canvas.height;//Establezco la relacion de aspecto
	// let near = 0.1;//Establezco la distancia minima que renderizare
	// let far = 10.0;//Establezco la distancia maxima que renderizare
	// projMatrix=camaraEsferica.createPerspectiveMatrix(fov,near,far,aspect);//Calculo la matriz de proyeccion
	projMatrix = camaraEsferica.projectionMatrix;
cameraMouseControls = new CameraMouseControls(camaraEsferica, canvas);

	gl.enable(gl.DEPTH_TEST);//Activo esta opcion para que dibuje segun la posicion en Z. Si hay dos fragmentos con las mismas x,y pero distinta zIndex
	//Dibujara los que esten mas cerca de la pantalla.
	setObjects();
	requestAnimationFrame(onRender)//Pido que inicie la animacion ejecutando onRender
}



/*Este metodo se llama constantemente gracias al metodo requestAnimationFrame(). En los sliders no
se llama al onRender, sino que unicamente actualiza valores. Luego el onRender recupera esos valores y transforma
los objetos como corresponda.*/
var last = 0;
var count = 0;
function onRender(now){
	now *= 0.001; //Tiempo actual
	var deltaTime = now - then; //El tiempo que paso desde la ultima llamada al onRender y la actual
	then = now; //Actualizo el valor
	count++;
	if(now - last> 1){
		console.log("FPS: "+count);
		count = 0;
		last = now;
	}

	/*Reinicio Matrices*/

	/*Comienzo a preparar para dibujar*/
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	refreshCamera(deltaTime * rotationSpeed); //Refresco la camara
	for(let i = 0; i<balls.length; i++){
    let arr = balls[i];
    for(let j = 0; j<arr.length; j++){
      drawObject(arr[j]);
    }
	}
	transformBall();
	drawObject(obj_ball);
	drawObject(obj_ball2);
	drawObject(obj_ball3);
	drawObject(obj_piso);
  //drawObject(obj_axis);

	requestAnimationFrame(onRender); //Continua el bucle
}

function initTexture(){
	texture = gl.createTexture();
	enrejado = gl.createTexture();
	fuego = gl.createTexture();
	texture.image = new Image();
	enrejado.image = new Image();
	fuego.image = new Image();
	texture.image.onload = function(){
		handleLoadedTexture(texture);
	}
	enrejado.image.onload = function(){
		handleLoadedTexture(enrejado);
	}
	fuego.image.onload = function(){
		handleLoadedTexture(fuego);
	}
	fuego.image.src = "textures/fuego.png";
	texture.image.src = "textures/texture1_256.jpg";
	enrejado.image.src = "textures/carbon-fiber.jpg";
	console.log(texture.image);
}

function handleLoadedTexture(texture){
	gl.bindTexture(gl.TEXTURE_2D,texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture.image);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D,null);
}


function refreshCamera(value){
	if(cameraAnimated){
		camaraEsferica.arcHorizontally(glMatrix.toRadian(value));
	}
	viewMatrix = camaraEsferica.viewMatrix;
	projectionMatrix = camaraEsferica.projectionMatrix;
}

function setObjects(){
	transformBalls();
	transformPiso();
}

function translateToOrigin(object){
	let matrix = object.getObjectMatrix();
	let translationVector = [-object.getCenter()[0],-object.getCenter()[1],-object.getCenter()[2]];
	let translationMatrix = mat4.create();
	mat4.fromTranslation(translationMatrix,translationVector);
	mat4.multiply(matrix,translationMatrix,matrix);
}

function scaleObject(object,scale){
	let matrix = object.getObjectMatrix();
	let scaleMatrix = mat4.create();//Creo una matriz de 4 dimensiones. Esta sera la matriz de escalado
	mat4.fromScaling(scaleMatrix,scale);//Creo la matriz de escalado
	mat4.multiply(matrix, scaleMatrix, matrix);//Aplico el escalado
}

function translateObject(object,translationVector){
	let matrix = object.getObjectMatrix();
	let translationMatrix = mat4.create();
	mat4.fromTranslation(translationMatrix,translationVector);
	mat4.multiply(matrix,translationMatrix,matrix);
}

function rotateObject(object,angle){
	let matrix = object.getObjectMatrix();
	let rotationMatrix = mat4.create();
	mat4.fromYRotation(rotationMatrix,glMatrix.toRadian(angle));
	mat4.multiply(matrix,rotationMatrix,matrix);
}
function rotateObjectZ(object,angle){
	let matrix = object.getObjectMatrix();
	let rotationMatrix = mat4.create();
	mat4.fromZRotation(rotationMatrix,glMatrix.toRadian(angle));
	mat4.multiply(matrix,rotationMatrix,matrix);
}

function transformBall(){
	obj_ball.resetObjectMatrix();
	translateToOrigin(obj_ball);
	scaleObject(obj_ball,[0.1,0.1,0.1]);
	if(light.isEnabled()){
		translateObject(obj_ball,light.getLightPosition());
	}
	else {
		translateObject(obj_ball,0.0,100.0,0.0);
	}

	obj_ball2.resetObjectMatrix();
	translateToOrigin(obj_ball2);
	scaleObject(obj_ball2,[0.03,0.03,0.03]);
	if(light2.isEnabled())
		translateObject(obj_ball2,light2.getLightPosition());
	else {
		translateObject(obj_ball2,0.0,100.0,0.0);
	}

	obj_ball3.resetObjectMatrix();
	translateToOrigin(obj_ball3);
	scaleObject(obj_ball3,[0.03,0.03,0.03]);
	let matrix = mat4.create();

	let matrizObjeto = obj_ball3.getObjectMatrix();
	//mat4.targetTo(matrix,camaraEsferica.getPosition(),[light3.getDirection()[0],light3.getDirection()[1],light3.getDirection()[2]],[0,1,0]);
	let direccion = light3.getDirection();
	if(direccion[0]==0 && direccion[2]==0){
		if(direccion[1]>0){
			rotateObjectZ(obj_ball3,-90);
		}
		if(direccion[1]<0){
			rotateObjectZ(obj_ball3,90);
		}
	}else{
	mat4.targetTo(matrix, [0,0,0], [-direccion[2],light3.getDirection()[1],-direccion[0]],[0,1,0]);
	mat4.multiply(matrizObjeto,matrix,matrizObjeto);
}
	if(light3.isEnabled())
		translateObject(obj_ball3,light3.getLightPosition());
	else {
		translateObject(obj_ball3,0.0,100.0,0.0);
	}


}

function transformBalls(){
	for(let i = 0; i<balls.length; i++){
    let arr = balls[i];
    for(let j = 0; j<arr.length; j++){
      arr[j].resetObjectMatrix();
			translateObject(arr[j],[-11 ,7.5,-19]);
			translateObject(arr[j],[7.5*j,0,7.5*i]);
			scaleObject(arr[j],[0.03,0.03,0.03])
    }
	}
}

function transformPiso(){
	translateToOrigin(obj_piso);
	scaleObject(obj_piso,[1,1,1]);
	scaleObject(obj_piso,[5,1,5]);
	translateObject(obj_piso,[0,-	0.9,0]);
}

/*Funcion para cargar los objetos*/
function onModelLoad() {
	//parsedOBJ = OBJParser.parseFile(teapot);
	parsedOBJ = OBJParser.parseFile(ball);
  parsedOBJ2 = OBJParser.parseFile(axis);
	parsedOBJ3 = OBJParser.parseFile(caja);
	parsedOBJ10 = OBJParser.parseFile(cone);
	parsedOBJ11 = OBJParser.parseFile(arrow);
}
