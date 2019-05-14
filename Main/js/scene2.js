//Variables para los objetos
var gl = null;
var shaderProgram  = null; //Shader program to use.
var parsedOBJ = null; //Archivos OBJ Traducidos para que los pueda leer webgl2
var parsedOBJ2 = null;
var parsedOBJ3 = null;
var parsedOBJ4 = null;
var parsedOBJ5 = null;
var parsedOBJ_Ferrari = [];
var parsedOBJ_BMW = [];

//Uniform locations.
var posLocation;
var vertexNormal_location;
var u_satelliteMatrix;
var u_planetMatrix;
var u_ring1Matrix;
var u_ring2Matrix;
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
var u_ro;
var u_sigma;
var u_limit;
var u_dirL;

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
var obj_bmw;
var obj_ford;
var obj_ferrari;
var obj_piso;
var ferrari;
var bmw;
//LUCES
var light;
var light_position = [0.0,5.0,0.0,1.0];
var light_intensity = [[0.01,0.01,0.01],[1.0,1.0,1.0],[1.0,1.0,1.0]];
var light_angle = 0.3;
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
	posLocation = gl.getAttribLocation(shaderProgram, 'vertexPos');
	vertexNormal_location = gl.getAttribLocation(shaderProgram, 'vertexNormal');
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
	u_ro = gl.getUniformLocation(shaderProgram, 'p');
	u_sigma = gl.getUniformLocation(shaderProgram, 'sigma');
	u_limit = gl.getUniformLocation(shaderProgram, 'limit');
	u_dirL = gl.getUniformLocation(shaderProgram,'dirL');

	//Creo objetos
	ferrari = new Car();
	let ferrari_chasis = new Object(parsedOBJ_Ferrari[0]);
	let ferrari_ruedas = new Object(parsedOBJ_Ferrari[1]);
	let ferrari_vidrio = new Object(parsedOBJ_Ferrari[2]);
	createVAO(ferrari_chasis);
	createVAO(ferrari_ruedas);
	createVAO(ferrari_vidrio);
	ferrari_chasis.setMaterial(getMaterialByName("Jade"));
	ferrari_ruedas.setMaterial(getMaterialByName("Polished Bronze"));
	ferrari_vidrio.setMaterial(getMaterialByName("Glass"));
	ferrari.addObject(ferrari_chasis);
	ferrari.addObject(ferrari_ruedas);
	ferrari.addObject(ferrari_vidrio);
	console.log(ferrari.getObjects()[2]);
	//obj_ferrari = new Object(parsedOBJ);
	//obj_bmw = new Object(parsedOBJ2);
	bmw = new Car();
	let bmw_chasis = new Object(parsedOBJ_BMW[0]);
	let bmw_ruedas = new Object(parsedOBJ_BMW[1]);
	let bmw_vidrio = new Object(parsedOBJ_BMW[2]);
	createVAO(bmw_chasis);
	createVAO(bmw_ruedas);
	createVAO(bmw_vidrio);
	bmw_chasis.setMaterial(getMaterialByName("Polished Gold"));
	bmw_ruedas.setMaterial(getMaterialByName("Bronze"));
	bmw_vidrio.setMaterial(getMaterialByName("Glass"));
	bmw.addObject(bmw_chasis);
	bmw.addObject(bmw_ruedas);
	bmw.addObject(bmw_vidrio);


	obj_ford = new Object(parsedOBJ3);
	obj_piso = new Object(parsedOBJ4);

	light = new Light(light_position , light_intensity , light_angle);//Creo la luz


	//Asigno VAOs
	// obj_ferrari.setVao(VAOHelper.create(obj_ferrari.getIndices(), [
	// 	new VertexAttributeInfo(obj_ferrari.getPositions(), posLocation, 3),
	// 	new VertexAttributeInfo(obj_ferrari.getNormals(), vertexNormal_location, 3)
	// ]));
	// obj_bmw.setVao(VAOHelper.create(obj_bmw.getIndices(),[
	// 	new VertexAttributeInfo(obj_bmw.getPositions(), posLocation, 3),
	// 	new VertexAttributeInfo(obj_bmw.getNormals(), vertexNormal_location, 3)
	// ]));
	obj_ford.setVao(VAOHelper.create(obj_ford.getIndices(),[
		new VertexAttributeInfo(obj_ford.getPositions(), posLocation, 3),
		new VertexAttributeInfo(obj_ford.getNormals(), vertexNormal_location, 3)
	]));
	obj_piso.setVao(VAOHelper.create(obj_piso.getIndices(),[
		new VertexAttributeInfo(obj_piso.getPositions(), posLocation, 3),
		new VertexAttributeInfo(obj_piso.getNormals(), vertexNormal_location, 3)
	]));

	//obj_ferrari.setMaterial(getMaterialByName("Jade"));
	//obj_bmw.setMaterial(getMaterialByName("Brass"));
	obj_ford.setMaterial(getMaterialByName("Polished Gold"));
	obj_piso.setMaterial(getMaterialByName("Polished Bronze"));

	gl.clearColor(0.05, 0.05, 0.05, 1.0); //Cambio el color de fondo
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//console.log(obj_ferrari.getCenter());
	//console.log(obj_bmw.getCenter());
	//console.log(obj_ford.getCenter());


	/*Creacion de camara*/
	camaraEsferica= new sphericalCamera(glMatrix.toRadian(angle[4]),glMatrix.toRadian(angle[5]),3,target,up);
	viewMatrix=camaraEsferica.createViewMatrix();//Calculo la matriz de vista
	let fov = glMatrix.toRadian(angle[3]); //Establezco el campo de vision inicial
	let aspect = canvas.width / canvas.height;//Establezco la relacion de aspecto
	let near = 0.1;//Establezco la distancia minima que renderizare
	let far = 10.0;//Establezco la distancia maxima que renderizare
	projMatrix=camaraEsferica.createPerspectiveMatrix(fov,near,far,aspect);//Calculo la matriz de proyeccion

	gl.enable(gl.DEPTH_TEST);//Activo esta opcion para que dibuje segun la posicion en Z. Si hay dos fragmentos con las mismas x,y pero distinta zIndex
	setObjects();
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


	//drawObject(obj_ferrari);
	let arr = ferrari.getObjects();
	for(let i = 0; i<arr.length; i++){
		drawObject(arr[i]);
	}
	let arr2 = bmw.getObjects();
	for(let i = 0; i<arr2.length; i++){
		drawObject(arr2[i]);
	}
	//drawObject(obj_bmw);
	drawObject(obj_ford);
	drawObject(obj_piso);

	gl.useProgram(null);
	requestAnimationFrame(onRender); //Continua el bucle
}

function setObjects(){
	/*Actualizo las transformaciones para cada uno de los objetos*/
	let arr = ferrari.getObjects();
	for(let i = 0; i<arr.length; i++){
		arr[i].resetObjectMatrix();
	}

	//obj_bmw.resetObjectMatrix();
	obj_ford.resetObjectMatrix();
	obj_piso.resetObjectMatrix();
	transformFerrari();
	transformBMW();
	transformFord();
	transformPiso();
}

function createVAO(object){
	object.setVao(VAOHelper.create(object.getIndices(), [
		new VertexAttributeInfo(object.getPositions(), posLocation, 3),
		new VertexAttributeInfo(object.getNormals(), vertexNormal_location, 3)
	]));
}

function refreshFrame(){

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
	//gl.uniform1f(u_ax,ax);
	//gl.uniform1f(u_ay,ay);
	gl.uniform4fv(u_posL, light.getLightPosition());
	gl.uniform3fv(u_ia, light.getIntensity()[0]);
	gl.uniform3fv(u_id, light.getIntensity()[1]);
	gl.uniform3fv(u_is, light.getIntensity()[2]);
	gl.uniform1f(u_limit, light.getAngle());
	gl.uniform3fv(u_dirL, [0.0,-1.0,0.0]);
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
	gl.uniform1f(u_ro,1.0);
	gl.uniform1f(u_sigma,90.0);
	let material = object.getMaterial();
	/*-----------------------PASO LOS VALORES DEL MATERIAL--------------------*/
	gl.uniform4fv(u_ka,material.getKa());
	gl.uniform4fv(u_kd,material.getKd());
	gl.uniform4fv(u_ks,material.getKs());
	gl.uniform1f(u_coefEspec,material.getShininess());

	gl.bindVertexArray(object.getVao());//Asocio el vao del planeta
	gl.drawElements(gl.TRIANGLES, object.getIndexCount(), gl.UNSIGNED_INT, 0);//Dibuja planeta
	gl.bindVertexArray(null);
}

/*Funcion para refrescar los angulos de rotacion automatica*/
function refreshAngles(deltaTime){
	 // A partir del tiempo que pasó desde el ultimo frame (timeDelta), calculamos los cambios que tenemos que aplicar al cubo
	for(let x = 0; x<10 ; x++){
		if(animated[x]){
			if(x==1){ //Si lo que se esta animando es el satelite
				rotationAngle[x] = -deltaTime * rotationSpeed+rotationAngle[x];//Acomodo el angulo de rotacion
				if(rotationAngle[x]<-360) //Verifico que no se pase de los valores establecidos para el slider
					rotationAngle[x]=360; //No hay problema alguno en que se pase, pero si se deja mucho tiempo corriendo
				if(rotationAngle[x]>360) //Puede llegar al maximo valor de integer y pueden llegar a ocurrir errores
					rotationAngle[x]=-360;
			}
			else
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
			else
				if(x==7){//Si lo que estoy animando es el planeta rotando automaticamente de forma horaria
				rotationAngle[x] =deltaTime * (-rotationSpeed) + rotationAngle[x];
				if(rotationAngle[x]<-360)
					rotationAngle[x]=360;
				if(rotationAngle[x]>360)
					rotationAngle[x]=-360;
			}
			else{//Si no es ninguno de los casos anteriores establezco un angulo de rotacion estandar
				rotationAngle[x] = deltaTime * rotationSpeed + rotationAngle[x];
				if(rotationAngle[x]>360)
					rotationAngle[x]=-360;
			}
		}
	}
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

/*Funcion para escalar el planeta*/
function transformFerrari(){
	let arr = ferrari.getObjects();
	for(let i = 0; i<arr.length; i++){
		//translateToOrigin(arr[i]);
		scaleObject(arr[i],[0.008,0.008,0.008]);
		rotateObject(arr[i],180);
		translateObject(arr[i],[0.4,0.05,-1]);
	}
	//translateObject(arr[1],[0,-0.08,0]);
	//translateObject(arr[2],[-0.1,0.1,0]);
}

function transformBMW(){
	let arr = bmw.getObjects();
	rotateObject(arr[1],270);
	for(let i = 0; i<arr.length; i++){
		//translateToOrigin(arr[i]);
		scaleObject(arr[i],[0.11,0.11,0.11]);
		rotateObject(arr[i],90);
		translateObject(arr[i],[0.3,-0.1,0])
	}
	scaleObject(arr[1],[0.3,0.3,0.3]);

	translateObject(arr[1],[-(0.225),0,0]);

}

function transformFord(){
	translateToOrigin(obj_ford);
	scaleObject(obj_ford,[0.12,0.12,0.12]);
	rotateObject(obj_ford,-90);
	translateObject(obj_ford,[0,0.1,1]);
}

function transformPiso(){
	translateToOrigin(obj_piso);
	translateObject(obj_piso,[0,-1.17,0]);
	translateObject(obj_piso,[light.getLightPosition()[0],0,light.getLightPosition()[2]]);
}


/*Funcion para cargar los objetos*/
function onModelLoad() {
	parsedOBJ_Ferrari = [OBJParser.parseFile(ferrari_chasis),OBJParser.parseFile(ferrari_ruedas),OBJParser.parseFile(ferrari_vidrio)];
	parsedOBJ = OBJParser.parseFile(ferrari); //Cargo el planeta
	parsedOBJ2 = OBJParser.parseFile(bmw); //Cargo el satelite
	parsedOBJ_BMW = [OBJParser.parseFile(bmw_chasis),OBJParser.parseFile(bmw_ruedas),OBJParser.parseFile(bmw_vidrio)];
	parsedOBJ3 = OBJParser.parseFile(ford);
	parsedOBJ4 = OBJParser.parseFile(piso);

}
