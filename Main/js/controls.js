//Funcion auxiliar que crea todos los materiales.
/*Se organiza de la siguiente manera.
Para crear un material es necesario darle el tipo, nombre, ka,kd,ks,coeficiente especular,F0 y sigma creo que era de cook torrance*/
function crearMateriales(){
	materials.push(new Material("Metal","Scarlet",[0.0,0.0,0.0],[0.7,0.0,0.0],[1.0,1.0,1.0],89.5,0.09,0.1));
	materials.push(new Material("Metal","Polished Gold",[0.0,0.0,0.0],[0.34615,0.3143,0.0903],[0.797357,0.723991,0.208006],83.2,0.1,0.1));
	materials.push(new Material("Metal","Polished Silver",[0.0,0.0,0.0],[0.2775,0.2775,0.2775],[0.773911,0.773911,0.773911],89.6,0.09,0.1));
	materials.push(new Material("Metal","Silver2",[0.0,0.0,0.0],[0.50754,0.50754,0.50754],[0.508273,0.508273,0.508273],51.2,0.09,0.1));
	materials.push(new Material("Metal","Chrome",[0.0,0.0,0.0],[0.4,0.4,0.4],[0.774597,0.774597,0.774597],76.8,0.09,0.1));
	materials.push(new Material("Metal","Polished Bronze",[0.0,0.0,0.0],[0.4,0.2368,0.1036],[0.774597,0.458561,0.200621],76.8,0.2,0.3));
	materials.push(new Material("Metal","Brass",[0.0,0.0,0.0],[0.780392,0.568627,0.113725],[0.992157,0.941176,0.807843],27.8974,0.2,0.05));
	materials.push(new Material("Metal","Bronze",[0.0,0.0,0.0],[0.714,0.4284,0.18144],[0.393548,0.271906,0.166721],25.6,0.09,0.1));
	//materials.push(new Material("Plastic","CACA",[0.0,0.0,0.0],[1.0,0.5,0.0],[0.0,0.0,0.0],0.0,0.09,0.1));
	// materials.push(new Material("Glass","Glass",[0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0],500.2,0.08,0.05));
	// materials.push(new Material("Plastic","Caucho",[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0],0,0.2,0.05));
	// materials.push(new Material("Plastic","Default",[1.0,1.0,1.0],[1.0,1.0,1.0],[1.0,1.0,1.0],100.0,0.2,0.05));
	// materials.push(new Material("Metal","Polished Silver",[0.23125,0.23125,0.23125],[0.2775,0.2775,0.2775],[0.773911,0.773911,0.773911],89.6,0.09,0.1));
	// materials.push(new Material("Metal","Silver2",[0.19225,0.19225,0.19225],[0.50754,0.50754,0.50754],[0.508273,0.508273,0.508273],51.2,0.09,0.1));
	// materials.push(new Material("Plastic","Ruby",[0.1745,0.01175,0.01175],[0.61424,0.04136,0.04136],[0.727811,0.626959,0.626959],12.8,0.09,0.1));
	// materials.push(new Material("Satin","Pearl",[0.25,0.20725,0.20725],[1.0,0.829,0.829],[0.296648,0.296648,0.296648],11.264,0.09,0.1));
	// materials.push(new Material("Satin","Obsidian",[0.05375,0.05,0.06625],[0.18275,0.17,0.22525],[0.332741,0.328634,0.346435],38.4,0.09,0.1));
	// materials.push(new Material("Satin","Emerald",[0.0215,0.1745,0.0215],[0.07568,0.61424,0.07568],[0.633,0.727811,0.633],76.8,0.09,0.1));
	// materials.push(new Material("Plastic","Turoquoise",[0.1,0.18725,0.1745],[0.396,0.74151,0.69102],[0.297254,0.30829,0.306678],12.8,0.09,0.1));
	// materials.push(new Material("Metal","Chrome",[0.25,0.25,0.25],[0.4,0.4,0.4],[0.774597,0.774597,0.774597],76.8,0.09,0.1));
	materials.push(new Material("Satin","Pearl",[0.0,0.0,0.0],[1.0,0.829,0.829],[0.296648,0.296648,0.296648],11.264,0.09,0.1));
	materials.push(new Material("Satin","Obsidian",[0.0,0.0,0.0],[0.18275,0.17,0.22525],[0.332741,0.328634,0.346435],38.4,0.09,0.1));
	materials.push(new Material("Satin","Emerald",[0.0,0.0,0.0],[0.07568,0.61424,0.07568],[0.633,0.727811,0.633],76.8,0.09,0.1));
	materials.push(new Material("Satin","Silver",[0.0,0.0,0.0],[0.5,0.6,0.5],[0.6,0.5,0.2],89.5,0.09,0.1));

	materials.push(new Material("Plastic","Caucho",[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0],0,0.2,0.05));
	materials.push(new Material("Plastic","Default",[1.0,1.0,1.0],[1.0,1.0,1.0],[1.0,1.0,1.0],100.0,0.2,0.05));
	materials.push(new Material("Plastic","Ruby",[0.0,0.0,0.0],[0.61424,0.04136,0.04136],[0.727811,0.626959,0.626959],12.8,0.09,0.1));
	materials.push(new Material("Plastic","Turquoise",[0.0,0.0,0.0],[0.396,0.74151,0.69102],[0.297254,0.30829,0.306678],12.8,0.09,0.1));
	materials.push(new Material("Plastic","Jade",[0.0,0.0,0.0],[0.54,0.89,0.63],[0.316228,0.316228,0.316228],12.8,0.09,0.1));
	materials.push(new Material("Plastic","Rock",[0.0,0.0,0.0],[0.95466,0.078,0.0],[0.00,0.0,0.0],0.0,2.81,0.05));

	materials.push(new Material("Glass","Glass",[0.0,0.0,0.0],[0.0,0.0,0.0],[1.0,1.0,1.0],500.2,0.08,0.05));
}

/*Funcion auxiliar para obtener un material segun su nombre. Este es el que se usa mas a lo largo del proyecto*/
function getMaterialByName(name){
	let i=0;
	let encontre = false;
	while(!encontre && i<materials.length){
		if(materials[i].getName()==name){
			encontre = true;
			return materials[i];
		}
		else {
			i++;
		}
	}
	if(!encontre)
		return materials[0];
}

/*Funcion auxiliar para obtener un material segun su indice. Se usa mas que nada en la primera escena*/
function getMaterialByIndex(index){
	if(index >= materials.length)
		index = materials.length - 1;
	if(index < 0)
		index = 0;
	return materials[index];
}

/*Metodo auxiliar que convierte luz en color kelvin a rgb*/
function colorLuz(num){
	//Algoritmo http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
	let temperature;
	temperature = num/100;
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
	return [red,green,blue];
}

/*Metodo auxiliar para cargar los materiales existentes en los dropdown.Debe reescribirse codigo de manera
forzada, sino guardara los valores unicamente en el ultimo dropdown existente.*/
function loadMaterials(){
	let selector1 = document.getElementById("select1");
	let selector2 = document.getElementById("select2");
	let selector3 = document.getElementById("select3");
	let option;
	let optGroup;
	let tipoActual = "";
	for(let i = 0; i<materials.length; i++){
		if(materials[i].getType()!=tipoActual){//En esta parte creo las subdivisiones para cada tipo de material
			optGroup = document.createElement("optgroup");
			tipoActual = materials[i].getType();
			optGroup.label = tipoActual;
			selector1.add(optGroup);
			optGroup = document.createElement("optgroup")
			optGroup.label = tipoActual;
			selector2.add(optGroup);
			optGroup = document.createElement("optgroup")
			optGroup.label = tipoActual;
			selector3.add(optGroup);
		}
		//Aca cargo las propias opciones de materiales
		option = document.createElement("option");
		option.text = materials[i].getName();
		selector1.add(option);
		option = document.createElement("option");
		option.text = materials[i].getName();
		selector2.add(option);
		option = document.createElement("option");
		option.text = materials[i].getName();
		selector3.add(option);
	}
}

/*Funcion para cargar los sliders de la pagina*/
function cargarSliders(){
	for(let i=2; i<5; i++){
		slider[i]=document.getElementById("slider"+(i));//Guardo el slider
		angle[i]=parseFloat(slider[i].defaultValue);//Actualizo el valor del angulo asociado al slider
		updateTextInput(i,slider[i].value);//Actualizo el valor del campo de texto asociado al slider
	}
	angle[2] = 91-slider[2].defaultValue; //Este es el angulo del slider del zoom
}


/*Metodo auxiliar para crear las luces. Puede hacerse mas simplificado*/
function createLights(){
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
	var light_direction3 = [1.0,0.1,0.0,0.0];
	var light_angle3 = Math.cos(glMatrix.toRadian(30));


	light = new Light(light_position , light_intensity , light_angle,light_direction);//Creo la luz
	light.setType(0);
	light2 = new Light(light_position2 , light_intensity2 , light_angle2,light_direction2);//Creo la luz
	light2.setType(1);
	light3 = new Light(light_position3 , light_intensity3 , light_angle3,light_direction3);//Creo la luz
	light3.setType(2);
	lights.push(light);
	lights.push(light2);
	lights.push(light3);
}

/*Metodo para cambiar las luces segun los valores preestablecidos en los sliders*/
function loadLights(){
	changeColorSlider(parseFloat(document.getElementById("sliderColor1").value),1);
	changeColorSlider(parseFloat(document.getElementById("sliderColor2").value),2);
	changeColorSlider(parseFloat(document.getElementById("sliderColor3").value),3);
}

/*Metodos auxiliares para cambiar el valor del slider mediante el textInput.
TODO: Hacer esto en una sola funcion.*/
function setNewValueSpot(value){
	document.getElementById("sliderColor1").value=parseFloat(value);
}

function setNewValuePuntual(value){
	document.getElementById("sliderColor2").value=parseFloat(value);
}

function setNewValuePuntual(value){
	document.getElementById("sliderColor3").value=parseFloat(value);
}

// function onSliderLuz(slider){
// 	angle[1] = parseFloat(slider.value);
// 	changed = true;
// 	updateTextInput(1,slider.value);
// }

/*Funcion para el slider de zoom de la camara*/
function onSliderZoomCamera(slider) {
	let delta = parseFloat(slider.value);
	angle[2] = 91-delta;
	changed=true;//Marco que hubo un cambio, lo cual habilita el reset
	updateTextInput(2,slider.value);//Actualizo el valor del campo de texto asociado al slider
}

/*funcion para el slider de los movimientos hacia arriba y hacia abajo de la camara*/
function onSliderUpDownCamera(slider){
	changed=true;//Marco que hubo un cambio, lo cual habilita el reset
	angle[3] = parseFloat(slider.value);
	updateTextInput(3,slider.value);//Actualizo el valor del campo de texto asociado al slider
}

/*Funcion para el slider de rotacion de la camara*/
function onSliderRotationCamera(slider) {
	changed=true;//Marco que hubo un cambio, lo cual habilita el reset
	angle[4] = parseFloat(slider.value);
	updateTextInput(4,slider.value);//Actualizo el valor del campo de texto asociado al slider
}

/*Funcion para actualizar el valor en el textField*/
function updateTextInput(num,val) {
    document.getElementById("textInput"+num).value=val;
}

//TODO: CAMBIAR VARIABLES POR ARREGLO
/*Funcion para setear nuevo valor al slider desde el textField*/
function setNewValue(num,value){
	//Si no es la cadena nula
	if(value!=""){
		//Convierto a float
		value=parseFloat(value);
		//Si no es un numero....
		if(Number.isNaN(value))
			value=0;
		if(num==1){
			slider1.value=value;
			onSliderLuz(slider1);
		}
		if(num==2){
			slider2.value=value;
			onSliderZoomCamera(slider2);
		}
		if(num==3){
			slider3.value=value;
			onSliderUpDownCamera(slider3);
		}
		if(num==4){
			slider4.value=value;
			onSliderRotationCamera(slider4);
		}
	}
}

/*Metodo auxiliar para cambiar la posicion de la luz en el caso de la spot y la puntual.
En el caso de la direccional se cambia la direccion.*/
function setLightPosition(index){
	let valueX = parseFloat(document.getElementById("textInputX"+index).value);
	let valueY = parseFloat(document.getElementById("textInputY"+index).value);
	let valueZ = parseFloat(document.getElementById("textInputZ"+index).value);
	if (index == 1)
		light.setLightPosition([valueX,valueY,valueZ,1.0]);
	if (index == 2)
		light2.setLightPosition([valueX,valueY,valueZ,1.0]);
	if (index == 3)
		light3.setDirection([valueX,valueY,valueZ,0.0]);
}


/*Metodo auxiliar para activar y desactivar luces de cualquier tipo
Me manejo con un boolean en cada luz que dice si esta encendido o no.
Si esta encendido devuelve todos los valores normalmente. Sino siempre va a devolver 0
Mas que nada que el color o intensidad sea 0 hace que se apague.
En los casos de la luz spot y la luz direccional con direccion 0 tambien se apaga */
function activarLuz(index){
	if(index == 1){
		if(light.isEnabled()){
			light.disable();
		}
		else {
			light.enable();
		}
	}
	if(index == 2){
		if(light2.isEnabled()){
			light2.disable();
		}
		else {
			light2.enable();
		}
	}
	if(index == 3){
		if(light3.isEnabled()){
			light3.disable();
		}
		else {
			light3.enable();
		}
	}
}


/*Funcion usada para animar*/
/*Funcionamiento: Se pasa al metodo un indice, el cual indica que boton se ha pulsado
y que accion debe llevar a cabo...
*/
function animateObject(index){
	changed=true; //Activo que hubo un cambio
		if(!cameraAnimated)
			cameraAnimated = true;
			else
				cameraAnimated = false;
		if(cameraMouseControls.isEnabled())
			cameraMouseControls.disable();
		else {
			cameraMouseControls.enable();
		}
	}


/*Funcion para resetear la escena.*/
function resetScene(){

		camaraEsferica.reset();
		lights[0].setLightPosition([0,2,0,1]);
		lights[0].setIntensity([[1,1,1],[0.1,0.1,0.1],[0.1,0.1,0.1]]);
		lights[1].setLightPosition([0,2,1,1]);
		lights[1].setDirection([0.0,-1.0,0.0,0.0]);
		lights[1].setAngle(Math.cos(glMatrix.toRadian(30)));
		lights[1].setIntensity([[1,1,1],[0.1,0.1,0.1],[0.1,0.1,0.1]]);
		lights[2].setLightPosition([0,2,-1,1]);
		lights[2].setIntensity([[1,1,1],[0.1,0.1,0.1],[0.1,0.1,0.1]]);
		lights[2].setDirection([1,0,0,0]);


	console.log("RESET");//Escribo un RESET para avisar que hizo algo
}

/*Metodo auxiliar para cambiar el material a varios autos*/
function changeMaterial(value,index){
	let car = getCarByName(toDraw[index-1]);
	let material = getMaterialByName(value);
	car.getObjects()[0].setMaterial(material);
}



function changeColor(value,index){
	let color = convertHexToRgb(value);
	if(index == 1){
		light.setIntensity([color,[0.0,0.0,0.0],[0.0,0.0,0.0]]);
		console.log(light.getIntensity());
	}
	if(index == 2){
		light2.setIntensity([color,[0.0,0.0,0.0],[0.0,0.0,0.0]]);
	}
	if(index == 3){
		light3.setIntensity([color,[0.0,0.0,0.0],[0.0,0.0,0.0]]);
	}
	console.log(value);
}

/*Metodo auxiliar para cambiar el color de la luz en funcion del slider*/
function changeColorSlider(value,index){
	let color = colorLuz(parseFloat(value));//Obtengo el color mediante el mapeo de kelvin a rgb
	if(index == 1){
		lights[0].setIntensity([color,[0.0,0.0,0.0],[0.0,0.0,0.0]]);
		document.getElementById("textInputSpot").value=value;
	}
	if(index == 2){
		lights[1].setIntensity([color,[0.0,0.0,0.0],[0.0,0.0,0.0]]);
		document.getElementById("textInputPuntual").value=value;
	}
	if(index == 3){
		lights[2].setIntensity([color,[0.0,0.0,0.0],[0.0,0.0,0.0]]);
		document.getElementById("textInputDireccional").value=value;
	}


}

/*Metodo auxiliar para convertir un color en hexa a rgb. Se llama desde el colorPicker*/
function convertHexToRgb(value){
	//2 digitos a la izquierda = red
	let red = value.substr(1,2);
	//2 digitos en el medio = green
	let green = value.substr(3,2);
	//2 digitos a la derecha = blue
	let blue = value.substr(5,2);
	//console.log(red + " " + green + " " + blue);
	//Ahora debo convertir cada uno a Decimal
	red = parseInt(red,16)/255;
	green = parseInt(green,16)/255;
	blue = parseInt(blue,16)/255;
	//console.log(red + " " + green + " " + blue );
	return [red,green,blue];
}

/*Metodo auxiliar para setear el angulo de la luz. Actualmente solo hay una luz spot en la
posicion 1 */
function setNewAngle(index,value){
	lights[parseInt(index)-1].setAngle(Math.cos(glMatrix.toRadian(parseFloat(value))));
	light = lights[0];
	light2 = lights[1];
	light3 = lights[2];
	console.log(index);
	console.log(parseFloat(value));
	console.log("Cambio angulo" + lights[index].getAngle());
}


/*Metodo auxiliar para setear las direcciones de la luz. Actualmente
solo hay dos luces que necesiten la direccion pero la direccional esta cubierta en el
metodo anterior de las posiciones TODO: Cambiar esto
*/
function setLightDirection(index){
	let valueX = parseFloat(document.getElementById("textInputXD"+index).value);
	let valueY = parseFloat(document.getElementById("textInputYD"+index).value);
	let valueZ = parseFloat(document.getElementById("textInputZD"+index).value);
	if (index == 1)
		light.setDirection([valueX,valueY,valueZ,0.0]);
	if (index == 2)
		light2.setDirection([valueX,valueY,valueZ,0.0]);
	if (index == 3)
		light3.setDirection([valueX,valueY,valueZ,0.0]);
}


/*Metodo auxiliar para cargar los autos en los dropdown*/
function loadCars(){
	let selector1 = document.getElementById("selectCar1");
	let selector2 = document.getElementById("selectCar2");
	let selector3 = document.getElementById("selectCar3");
	let option;
	let optGroup;
	let tipoActual = "";
	for(let i = 0; i<obj_cars.length; i++){
		option = document.createElement("option");
		option.text = obj_cars[i].getName();
		selector1.add(option);
		option = document.createElement("option");
		option.text = obj_cars[i].getName();
		selector2.add(option);
		option = document.createElement("option");
		option.text = obj_cars[i].getName();
		selector3.add(option);
	}
}

/*Metodo auxiliar para cambiar el auto mostrado en pantalla*/
function changeCar(value,index){ //Obtengo tanto el valor como el numero del auto a cambiar
	if(toDraw[0]!=value && toDraw[1]!=value && toDraw[2]!=value ){ //Si ese auto no esta siendo dibujado en otra posicion...
		toDraw[index-1]=value;//Seteo en la posicion elegida el auto nuevo (Arreglo de autos a dibujar)
		console.log("Cambio auto" + value);
		changeMaterial(document.getElementById("select"+index).value,index);//Cambio el material del auto segun el valor actual del material
	}

}

function showFPS(){

}
