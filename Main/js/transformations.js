
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
	for(let i = 0; i<arr.length; i++){
		scaleObject(arr[i],[0.008,0.008,0.008]);
		rotateObject(arr[i],180);
		translateObject(arr[i],[0.4,0.05,-1]);
	}
}

function transformBugatti(){
	let arr = bugatti.getObjects();
	for(let i = 0; i<arr.length; i++){
		//translateToOrigin(arr[0]);
		scaleObject(arr[i],[0.002,0.002,0.002]);
		rotateObject(arr[i],180);
		translateObject(arr[i],[0.04,0.0,0.2]);
		translateObject(arr[i],[0,0.0,-1]);
	}
}

function transformCamaro(){
	let arr = camaro.getObjects();
	for(let i = 0; i<arr.length; i++){
		translateToOrigin(arr[0]);
		scaleObject(arr[i],[0.065,0.065,0.065]);
		rotateObject(arr[i],90);
		translateObject(arr[i],[0.04,-0.012,1.0]);
		//translateObject(arr[i],[0,0.0,1]);
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
		// scaleObject(arr[i],[0.06,0.06,0.06]);
		// rotateObject(arr[i],90);
		// translateObject(arr[i],[0,-0.282,1])
		translateToOrigin(arr[i]);
		scaleObject(arr[i],[0.2,0.2,0.2]);
		rotateObject(arr[i],180);
		translateObject(arr[i],[0,0,1])
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
