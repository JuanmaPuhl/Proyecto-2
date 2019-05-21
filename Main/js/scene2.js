//Variables para los objetos
var gl = null;

var parsedOBJ = null; //Archivos OBJ Traducidos para que los pueda leer webgl2
var parsedOBJ2 = null;
var parsedOBJ3 = null;
var parsedOBJ4 = null;
var parsedOBJ5 = null;
var parsedOBJ_Ferrari = [];
var parsedOBJ_BMW = [];
var parsedOBJ_Lexus = [];

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
var obj_cars = [];
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

var lights = [];
var light;
var light2;
var light3;
/*Esta funcion se ejecuta al cargar la pagina. Carga todos los objetos para que luego sean dibujados, asi como los valores iniciales
de las variables a utilizar*/
function onLoad() {
	let canvas = document.getElementById('webglCanvas');
	gl = canvas.getContext('webgl2');

	//Cargo los objetos a la escena
	onModelLoad();
	cargarSliders();//Cargo los sliders
	crearMateriales();//Creacion de MATERIALES
	createShaderPrograms();
	setShaderBlinnPhong();
	loadMaterials();
	//Creo autos
	ferrari = new Car();
	let ferrari_colors = ["Pearl","Caucho","Bronze","Glass","Scarlet"];
	ferrari.setColors(ferrari_colors);
	ferrari.setOBJ(parsedOBJ_Ferrari);

	bmw = new Car();
	let bmw_colors = ["Chrome","Caucho","Glass","Bronze","Scarlet","Scarlet"];
	bmw.setColors(bmw_colors);
	bmw.setOBJ(parsedOBJ_BMW);

	lexus = new Car();
	let lexus_colors = ["Polished Gold","Bronze","Caucho","Glass"];
	lexus.setColors(lexus_colors);
	lexus.setOBJ(parsedOBJ_Lexus);

	obj_cars.push(lexus);
	obj_cars.push(bmw);
	obj_cars.push(ferrari);

	for(let i = 0; i<obj_cars.length; i++){
		createCar(obj_cars[i],obj_cars[i].getOBJ());
	}

	obj_ball = new Object(parsedOBJ2);
	obj_ball2 = new Object(parsedOBJ3);
	obj_ball3 = new Object(parsedOBJ5);
	obj_piso = new Object(parsedOBJ4);

	createLights();
	loadLights();
	light = lights[0];
	light2 = lights[1];
	light3 = lights[2];
	createVAO(obj_piso);
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
	/*Comienzo a preparar para dibujar*/
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.useProgram(shaderProgram);

	refreshCamera();
	obj_ball.resetObjectMatrix();

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

function createCar(car,parsedOBJ_arr){
	let colors = car.getColors();
	for(let i = 0 ; i<parsedOBJ_arr.length; i++){
		let objeto = new Object(parsedOBJ_arr[i]);
		createVAO(objeto);
		if(i<colors.length)
			objeto.setMaterial(getMaterialByName(colors[i]));
		else
			objeto.setMaterial(getMaterialByName("Default"));
		car.addObject(objeto);
	}
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

function rotateObjectZ(object,angle){
	let matrix = object.getObjectMatrix();
	let rotationMatrix = mat4.create();
	mat4.fromZRotation(rotationMatrix,glMatrix.toRadian(angle));
	mat4.multiply(matrix,rotationMatrix,matrix);
}

/*Funcion para escalar el planeta*/
function transformFerrari(){
	let arr = ferrari.getObjects();
	// for(let i = 0; i<arr.length; i++){
	// 	scaleObject(arr[i],[0.008,0.008,0.008]);
	// 	rotateObject(arr[i],180);
	// 	translateObject(arr[i],[0.4,0.05,-1]);
	// }
	for(let i = 0; i<arr.length; i++){
		//translateToOrigin(arr[0]);
		scaleObject(arr[i],[0.002,0.002,0.002]);
		rotateObject(arr[i],180);
		translateObject(arr[i],[0.04,0.0,0.2]);
		translateObject(arr[i],[0,0.0,-1]);
	}

}

function transformBMW(){

	let arr = bmw.getObjects();
	console.log(arr);
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
		scaleObject(arr[i],[0.06,0.06,0.06]);
		rotateObject(arr[i],90);
		translateObject(arr[i],[0,-0.282,1])
	}
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
	scaleObject(obj_ball3,[0.03,0.03,0.03]);
	let matrix = mat4.create();

	let matrizObjeto = obj_ball3.getObjectMatrix();
	let direccion = light3.getDirection();
	if(direccion[0]==0 && direccion[2]==0){
		if(direccion[1]>0){
			rotateObjectZ(obj_ball3,-90);
		}
		if(direccion[1]<0){
			rotateObjectZ(obj_ball3,90);
		}
	}
	else{
		mat4.targetTo(matrix, [0,0,0], [direccion[2],light3.getDirection()[1],direccion[0]],[0,1,0]);
		mat4.multiply(matrizObjeto,matrix,matrizObjeto);
	}
	if(light3.isEnabled())
		translateObject(obj_ball3,light3.getLightPosition());
	else {
		translateObject(obj_ball3,0.0,100.0,0.0);
	}
}




/*Funcion para cargar los objetos*/
function onModelLoad() {
	//parsedOBJ_Ferrari = [OBJParser.parseFile(ferrari_chasis),OBJParser.parseFile(ferrari_ruedas),OBJParser.parseFile(ferrari_vidrio)];
	parsedOBJ_Ferrari = [OBJParser.parseFile(bugatti_chasis),OBJParser.parseFile(bugatti_ruedas),OBJParser.parseFile(bugatti_llantas),OBJParser.parseFile(bugatti_vidrios),OBJParser.parseFile(bugatti_luces_freno)];
	parsedOBJ2 = OBJParser.parseFile(cone); //Cargo el satelite
	parsedOBJ3 = OBJParser.parseFile(ball);
	parsedOBJ_BMW = [OBJParser.parseFile(bmw_chasis),OBJParser.parseFile(bmw_ruedas),OBJParser.parseFile(bmw_vidrio),OBJParser.parseFile(bmw_llantas),OBJParser.parseFile(bmw_frenos),OBJParser.parseFile(bmw_luces_freno)];
	parsedOBJ_Lexus = [OBJParser.parseFile(lexus_chasis),OBJParser.parseFile(lexus_llantas),OBJParser.parseFile(lexus_ruedas),OBJParser.parseFile(lexus_vidrios)];
	parsedOBJ4 = OBJParser.parseFile(caja);
	parsedOBJ5 = OBJParser.parseFile(arrow);
}
