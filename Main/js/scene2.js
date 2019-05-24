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
var lamborghini;
var bugatti;
var camaro;
var bmw;
var lexus;
var obj_ball;
var obj_ball2;
var obj_ball3;

var lights = [];
var light;
var light2;
var light3;

var texture;
var enrejado;
var fuego;
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
	setShaderCookTorrance();
	loadMaterials();
	initTexture();
	//Creo autos

	ferrari = new Car("Ferrari");
	let ferrari_textures = [null,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	let ferrari_colors = ["Pearl","Caucho","Bronze","Glass","Scarlet"];
	//createCarShell("Ferrari",ferrari_textures,ferrari_colors,180,[0.008,0.008,0.008],[0.4,0.05,-1],parsedBOJ_Ferrari);
	ferrari.setColors(ferrari_colors);
	ferrari.setOBJ(parsedOBJ_Ferrari);
	ferrari.setTextures(ferrari_textures);
	ferrari.setRotation(180);
	ferrari.setTraslation([0.4,0.05,-1]);
	ferrari.setScale([0.008,0.008,0.008]);

	bmw = new Car("BMW");
	let bmw_textures = [null,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	let bmw_colors = ["Chrome","Caucho","Glass","Bronze","Scarlet","Scarlet","Caucho","Scarlet","Caucho","Caucho","Caucho"];
	bmw.setColors(bmw_colors);
	bmw.setOBJ(parsedOBJ_BMW);
	bmw.setTextures(bmw_textures);
	//createCarShell("BMW",bmw_textures,bmw_);

	lexus = new Car("Lexus");
	let lexus_textures = [null,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	let lexus_colors = ["Polished Gold","Bronze","Caucho","Glass"];
	lexus.setColors(lexus_colors);
	lexus.setOBJ(parsedOBJ_Lexus);
	lexus.setTextures(lexus_textures);

	camaro = new Car("Camaro");
	let camaro_textures = [null,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	let camaro_colors = ["Chrome","Caucho","Glass","Bronze","Scarlet","Scarlet","Caucho","Scarlet","Caucho","Caucho","Caucho"];
	camaro.setColors(camaro_colors);
	camaro.setOBJ(parsedOBJ_Camaro);
	camaro.setTextures(camaro_textures);

	bugatti = new Car("Bugatti");
	let bugatti_textures = [null,null,null,null,null,null,enrejado,fuego,enrejado,enrejado,enrejado];
	let bugatti_colors = ["Chrome","Caucho","Glass","Bronze","Scarlet","Scarlet","Caucho","Scarlet","Caucho","Caucho","Caucho"];
	bugatti.setColors(bugatti_colors);
	bugatti.setTextures(camaro_textures);
	bugatti.setOBJ(parsedOBJ_Bugatti);
	bugatti.setRotation(180);
	bugatti.setTraslation([0.04,0.0,-0.8]);
	bugatti.setScale([0.002,0.002,0.002]);

	obj_cars.push(lexus);
	obj_cars.push(bmw);
	obj_cars.push(ferrari);
	obj_cars.push(camaro);
	obj_cars.push(bugatti);

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
	transformObjects();
	//Dibujara los que esten mas cerca de la pantalla.
	requestAnimationFrame(onRender)//Pido que inicie la animacion ejecutando onRender
}

/*Este metodo se llama constantemente gracias al metodo requestAnimationFrame(). En los sliders no
se llama al onRender, sino que unicamente actualiza valores. Luego el onRender recupera esos valores y transforma
los objetos como corresponda.*/
var last = 0;
var count = 0;
var deltaTime;
function onRender(now){
	now *= 0.001; //Tiempo actual
	deltaTime = now - then; //El tiempo que paso desde la ultima llamada al onRender y la actual
	count++;
	if(now - last> 1){
		console.log("FPS: "+count);
		count = 0;
		last = now;
	}
	then = now; //Actualizo el valor
	refreshAngles(deltaTime); //Actualizo los angulos teniendo en cuenta el desfasaje de tiempo
	/*Comienzo a preparar para dibujar*/
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	refreshCamera();
	obj_ball.resetObjectMatrix();

	drawCars(["Ferrari","BMW","Camaro"]);
	transformBall();
	drawObject(obj_ball);
	drawObject(obj_ball2);
	drawObject(obj_ball3);
	drawObject(obj_piso);
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
	texture.image.src = "textures/fuego.png";
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

function createVAO(object){
	object.setVao(VAOHelper.create(object.getIndices(), [
		new VertexAttributeInfo(object.getPositions(), posLocation, 3),
		new VertexAttributeInfo(object.getNormals(), vertexNormal_location, 3),
		new VertexAttributeInfo(object.getTextures(),texLocation,2)
	]));
}

function createCar(car,parsedOBJ_arr){
	let colors = car.getColors();
	let textures = car.getTextures();
	for(let i = 0 ; i<parsedOBJ_arr.length; i++){
		let objeto = new Object(parsedOBJ_arr[i]);
		createVAO(objeto);
		objeto.setTexture(textures[i]);
		//objeto.setTexture(texture);
		//console.log(texture.image);
		if(i<colors.length)
			objeto.setMaterial(getMaterialByName(colors[i]));
		else
			objeto.setMaterial(getMaterialByName("Default"));
		car.addObject(objeto);
	}
}

function transformObjects(){
	/*Actualizo las transformaciones para cada uno de los objetos*/
	transformFerrari();
	transformBMW();
	transformLexus();
	transformPiso();
	transformBall();
	transformBugatti();
	transformCamaro();
}

function createCarShell(name,textures,colors,rotation,scale,traslation,obj){
	let car = new Car(name);
	bugatti.setColors(colors);
	bugatti.setTextures(textures);
	bugatti.setOBJ(obj);
	bugatti.setRotation(rotation);
	bugatti.setTraslation(traslation);
	bugatti.setScale(scale);
	createCar(car,car.getOBJ())
}

function drawCars(carsArr){
	for(let k = 0; k<carsArr.length;k++){
		for(let i = 0; i<obj_cars.length; i++){
			if(obj_cars[i].getName()==carsArr[k]){
				let objetos = obj_cars[i].getObjects();
				for(let j = 0; j<objetos.length; j++){
					drawObject(objetos[j]);
				}
			}
		}
	}
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

/*Funcion para cargar los objetos*/
function onModelLoad() {
	parsedOBJ_Ferrari = [OBJParser.parseFile(ferrari_chasis),OBJParser.parseFile(ferrari_ruedas),OBJParser.parseFile(ferrari_vidrio)];
	//parsedOBJ_Ferrari = [OBJParser.parseFile(bugatti_chasis),OBJParser.parseFile(bugatti_ruedas),OBJParser.parseFile(bugatti_llantas),OBJParser.parseFile(bugatti_vidrios),OBJParser.parseFile(bugatti_luces_freno)];
	parsedOBJ2 = OBJParser.parseFile(cone); //Cargo el satelite
	parsedOBJ3 = OBJParser.parseFile(ball);
	parsedOBJ_BMW = [OBJParser.parseFile(bmw_chasis),OBJParser.parseFile(bmw_ruedas),OBJParser.parseFile(bmw_vidrio),OBJParser.parseFile(bmw_llantas),OBJParser.parseFile(bmw_frenos),OBJParser.parseFile(bmw_luces_freno),OBJParser.parseFile(bmw_capo),OBJParser.parseFile(bmw_puertas),OBJParser.parseFile(bmw_techo),OBJParser.parseFile(bmw_manijas),OBJParser.parseFile(bmw_baul)];
	//parsedOBJ_Lexus = [OBJParser.parseFile(lexus_chasis),OBJParser.parseFile(lexus_llantas),OBJParser.parseFile(lexus_ruedas),OBJParser.parseFile(lexus_vidrios)];
	parsedOBJ_Lexus = [OBJParser.parseFile(lambo)];
	parsedOBJ4 = OBJParser.parseFile(caja);
	parsedOBJ5 = OBJParser.parseFile(arrow);
	parsedOBJ_Camaro = [OBJParser.parseFile(camaro)];
	parsedOBJ_Bugatti = [OBJParser.parseFile(bugatti_chasis),OBJParser.parseFile(bugatti_ruedas),OBJParser.parseFile(bugatti_llantas),OBJParser.parseFile(bugatti_vidrios),OBJParser.parseFile(bugatti_luces_freno)];
}
