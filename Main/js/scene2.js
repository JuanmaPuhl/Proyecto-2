//Variables para los objetos
var gl = null;

var parsedOBJ = null; //Archivos OBJ Traducidos para que los pueda leer webgl2
var parsedOBJ2 = null;
var parsedOBJ3 = null;
var parsedOBJ4 = null;
var parsedOBJ5 = null;
var parsedOBJ_Ferrari = [];
var parsedOBJ_BMW = [];

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
var lexus;
var obj_ball;
var obj_ball2;
var obj_ball3;

//LUCES
var light;
var light_position = [0.0,2.0,0.0,1.0];
var light_intensity = [[0.01,0.01,0.01],[1.0,1.0,1.0],[1.0,1.0,1.0]];
var light_direction = [0.0,-1.0,0.0,0.0];
var light_angle = Math.cos(glMatrix.toRadian(30));

var light2;
var light_position2 = [0.0,2.0,1.0,1.0];
var light_intensity2 = [[0.01,0.01,0.01],[1.0,1.0,1.0],[1.0,1.0,1.0]];
var light_direction2 = [0.0,-1.0,0.0,0.0];
var light_angle2 = Math.cos(glMatrix.toRadian(30));

var light3;
var light_position3 = [0.0,2.0,-1.0,1.0];
var light_intensity3 = [[0.01,0.01,0.01],[1.0,1.0,1.0],[1.0,1.0,1.0]];
var light_direction3 = [0.0,-1.0,0.0,0.0];
var light_angle3 = Math.cos(glMatrix.toRadian(30));

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


	createShaderPrograms();
	setShaderBlinnPhong();

	//Creo objetos
	ferrari = new Car();
	let ferrari_colors = ["Jade","Polished Bronze","Glass"];
	for(let i = 0 ; i<parsedOBJ_Ferrari.length; i++){
		let objeto = new Object(parsedOBJ_Ferrari[i]);
		createVAO(objeto);
		if(i<ferrari_colors.length)
			objeto.setMaterial(getMaterialByName(ferrari_colors[i]));
		else
			objeto.setMaterial(getMaterialByName("Default"));
		ferrari.addObject(objeto);
	}

	bmw = new Car();
	let bmw_colors = ["Silver","Caucho","Glass","Bronze","Scarlet"];
	for(let i = 0 ; i<parsedOBJ_BMW.length; i++){
		let objeto = new Object(parsedOBJ_BMW[i]);
		createVAO(objeto);
		if(i<bmw_colors.length)
			objeto.setMaterial(getMaterialByName(bmw_colors[i]));
		else
			objeto.setMaterial(getMaterialByName("Default"));
		bmw.addObject(objeto);
	}

	lexus = new Car();
	let lexus_colors = ["Polished Gold","Bronze","Caucho","Glass"];
	for(let i = 0 ; i<parsedOBJ_Lexus.length; i++){
		let objeto = new Object(parsedOBJ_Lexus[i]);
		createVAO(objeto);
		if(i<lexus_colors.length)
			objeto.setMaterial(getMaterialByName(lexus_colors[i]));
		else
			objeto.setMaterial(getMaterialByName("Default"));
		lexus.addObject(objeto);
	}

	//console.log(lexus.getObjects());
	obj_ball = new Object(parsedOBJ2);
	obj_ball2 = new Object(parsedOBJ2);
	obj_ball3 = new Object(parsedOBJ2);
	//obj_ford = new Object(parsedOBJ3);
	obj_piso = new Object(parsedOBJ4);

	light = new Light(light_position , light_intensity , light_angle,light_direction);//Creo la luz
	light2 = new Light(light_position2 , light_intensity2 , light_angle2,light_direction2);//Creo la luz
	light3 = new Light(light_position3 , light_intensity3 , light_angle3,light_direction3);//Creo la luz


	// obj_ford.setVao(VAOHelper.create(obj_ford.getIndices(),[
	// 	new VertexAttributeInfo(obj_ford.getPositions(), posLocation, 3),
	// 	new VertexAttributeInfo(obj_ford.getNormals(), vertexNormal_location, 3)
	// ]));
	obj_piso.setVao(VAOHelper.create(obj_piso.getIndices(),[
		new VertexAttributeInfo(obj_piso.getPositions(), posLocation, 3),
		new VertexAttributeInfo(obj_piso.getNormals(), vertexNormal_location, 3)
	]));
	createVAO(obj_ball);
	createVAO(obj_ball2);
	createVAO(obj_ball3);
	//obj_ford.setMaterial(getMaterialByName("Polished Gold"));
	obj_piso.setMaterial(getMaterialByName("Rock"));
	obj_ball.setMaterial(getMaterialByName("Default"));
	obj_ball2.setMaterial(getMaterialByName("Default"));
	obj_ball3.setMaterial(getMaterialByName("Default"));

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
	console.log(angle[10]);
	gl.enable(gl.DEPTH_TEST);//Activo esta opcion para que dibuje segun la posicion en Z. Si hay dos fragmentos con las mismas x,y pero distinta zIndex
	setObjects();
	//console.log(ferrari.getObjects()[1].getVao());
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
	//revisarMenus();
	/*Comienzo a preparar para dibujar*/
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.useProgram(shaderProgram);

	refreshCamera();
	obj_ball.resetObjectMatrix();

	//passLight(light);

	//drawObject(obj_ferrari);
	let arr = ferrari.getObjects();
	for(let i = 0; i<arr.length; i++){
		drawObject(arr[i]);
	}
	let arr2 = bmw.getObjects();
	//console.log("" +arr2[1].getVao());
	for(let i = 0; i<arr2.length; i++){
		drawObject(arr2[i]);
	}
	let arr3 = lexus.getObjects();
	for(let i = 0; i<arr3.length; i++){
		drawObject(arr3[i]);
	}

	transformBall();
	drawObject(obj_ball);
	drawObject(obj_ball2);
	drawObject(obj_ball3);
	drawObject(obj_piso);

	gl.useProgram(null);
	requestAnimationFrame(onRender); //Continua el bucle
}

function setObjects(){
	/*Actualizo las transformaciones para cada uno de los objetos*/
	transformFerrari();
	transformBMW();
	transformLexus();
	transformPiso();
	transformBall();
}

function createVAO(object){
	object.setVao(VAOHelper.create(object.getIndices(), [
		new VertexAttributeInfo(object.getPositions(), posLocation, 3),
		new VertexAttributeInfo(object.getNormals(), vertexNormal_location, 3)
	]));
}


function refreshCamera(){
	if(animated[5]) //Si esta rotando automaticamente a la izquierda...
		viewMatrix = camaraEsferica.quaternionCamera(glMatrix.toRadian(rotationAngle[5]),glMatrix.toRadian(angle[3])); //Roto segun el angulo de rotacion 5
	else
		if(animated[6]) //Si esta rotando automaticamente a la derecha...
			viewMatrix = camaraEsferica.quaternionCamera(glMatrix.toRadian(rotationAngle[6]),glMatrix.toRadian(angle[3])); //Roto segun el angulo de rotacion 6
		else {// Si no esta siendo animada
			viewMatrix = camaraEsferica.quaternionCamera(glMatrix.toRadian(angle[4]),glMatrix.toRadian(angle[3])); //Roto segun el angulo del slider
		}
	projMatrix=camaraEsferica.zoom(angle[2]);//Vuelvo a calcular la matriz de proyeccion (Perspectiva)
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
		translateObject(arr[i],[0.3,-0.15,0])
	}
	scaleObject(arr[1],[0.3,0.3,0.3]);
	translateObject(arr[1],[-(0.225),-0.03,0]);
	rotateObject(arr[3],-90);
	scaleObject(arr[3],[0.3,0.3,0.3]);
	translateObject(arr[3],[-(0.137),-0.03,-0.0898]);
	rotateObject(arr[4],-90);
	scaleObject(arr[4],[0.3,0.3,0.3]);
	translateObject(arr[4],[-(0.137),-0.03,-0.0898]);
}

function transformLexus(){
	let arr = lexus.getObjects();
	for(let i = 0; i<arr.length; i++){
		//translateToOrigin(arr[i]);
		//console.log(arr);
		scaleObject(arr[i],[0.06,0.06,0.06]);
		rotateObject(arr[i],90);
		translateObject(arr[i],[0,-0.282,1])
	}
	// translateToOrigin(obj_ford);
	// scaleObject(obj_ford,[0.06,0.06,0.06]);
	// rotateObject(obj_ford,90);
	// translateObject(obj_ford,[0,-0.05,1]);
}

function transformPiso(){
	translateToOrigin(obj_piso);
	scaleObject(obj_piso,[1,1,1]);
	scaleObject(obj_piso,[5,1,5]);
	translateObject(obj_piso,[0,-	1.15,0]);
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
		scaleObject(obj_ball2,[0.1,0.1,0.1]);
		if(light2.isEnabled())
			translateObject(obj_ball2,light2.getLightPosition());
		else {
			translateObject(obj_ball2,0.0,100.0,0.0);
		}

		obj_ball3.resetObjectMatrix();
		translateToOrigin(obj_ball3);
		scaleObject(obj_ball3,[0.1,0.1,0.1]);
		if(light3.isEnabled())
			translateObject(obj_ball3,light3.getLightPosition());
		else {
			translateObject(obj_ball3,0.0,100.0,0.0);
		}

	}


/*Funcion para cargar los objetos*/
function onModelLoad() {
	parsedOBJ_Ferrari = [OBJParser.parseFile(ferrari_chasis),OBJParser.parseFile(ferrari_ruedas),OBJParser.parseFile(ferrari_vidrio)];
	//parsedOBJ = OBJParser.parseFile(ferrari); //Cargo el planeta
	parsedOBJ2 = OBJParser.parseFile(ball); //Cargo el satelite
	parsedOBJ_BMW = [OBJParser.parseFile(bmw_chasis),OBJParser.parseFile(bmw_ruedas),OBJParser.parseFile(bmw_vidrio),OBJParser.parseFile(bmw_llantas),OBJParser.parseFile(bmw_frenos)];
	//parsedOBJ3 = OBJParser.parseFile(lexus);
	parsedOBJ_Lexus = [OBJParser.parseFile(lexus_chasis),OBJParser.parseFile(lexus_llantas),OBJParser.parseFile(lexus_ruedas),OBJParser.parseFile(lexus_vidrios)];
	//parsedOBJ3 = OBJParser.parseFile(pg);
	parsedOBJ4 = OBJParser.parseFile(caja);

}
