//Variables para los objetos
var gl = null;
var shaderProgram  = null; //Shader program to use.
var parsedOBJ = null;

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

//LUCES
var light;
var light_position = [0.0,0.0,10.0,1.0];
var light_intensity = [[0.01,0.01,0.01],[1.0,1.0,1.0],[1.0,1.0,1.0]];
var light_angle = 0.0;

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


	for(let i = 0; i<6; i++){ //Pelotas
    let arr = [];
      for(let j=0; j<4; j++){
        arr.push(new Object(parsedOBJ));
  			arr[j].setMaterial(getMaterialByIndex(j%materials.length));
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
      mat4.fromTranslation(translationMatrix,[-10,0,20]);
      mat4.multiply(matrix,translationMatrix,matrix);
      translationMatrix = mat4.create();
      mat4.fromScaling(scaleMatrix,[0.08,0.08,0.08]);
      mat4.fromTranslation(translationMatrix,[2*j,0,-3*i]);
      mat4.multiply(matrix,translationMatrix,matrix);
      mat4.multiply(matrix,scaleMatrix,matrix);
      drawObject(arr[j]);
    }
	}
	//drawObject(obj_planet);
	//drawObject(obj_satellite);
	//drawObject(obj_ring1);
	//drawObject(obj_ring2);
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
			viewMatrix = camaraEsferica.quaternionCamera(glMatrix.toRadian(angle[5]),glMatrix.toRadian(angle[4])); //Roto segun el angulo del slider
		}
	projMatrix=camaraEsferica.zoom(angle[3]);//Vuelvo a calcular la matriz de proyeccion (Perspectiva)
}

function passCamera(){
	gl.uniformMatrix4fv(u_viewMatrix, false, viewMatrix);
	gl.uniformMatrix4fv(u_projMatrix, false, projMatrix);
}

function passLight(light){
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

/*Funcion para cargar los objetos*/
function onModelLoad() {
	//parsedOBJ = OBJParser.parseFile(teapot);
	parsedOBJ = OBJParser.parseFile(ball);
}
