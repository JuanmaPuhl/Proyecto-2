function crearMateriales(){
	materials.push(new Material("Default",[1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0],[1.0,1.0,1.0,1.0],100.0));
	materials.push(new Material("Jade",[0.135,0.2225,0.1575,0.95],[0.54,0.89,0.63,0.95],[0.316228,0.316228,0.316228,0.95],12.8));
	materials.push(new Material("Polished Gold",[0.24725,0.2245,0.0645,1.0],[0.34615,0.3143,0.0903,1.0],[0.797357,0.723991,0.208006,1.0],83.2));
	materials.push(new Material("Rock",[0.2,0.1,0.0,1.0],[0.095466,0.114934,0.102149,1.0],[0.1,0.1,0.1,1.0],2.0));
	materials.push(new Material("Brass",[0.329412,.223529,0.027451,1.0],[0.780392,0.568627,0.113725,1.0],[0.992157,0.941176,0.807843,1.0],27.8974));
	materials.push(new Material("Bronze",[0.2125,0.1275,0.054,1.0],[0.714,0.4284,0.18144,1.0],[0.393548,0.271906,0.166721,1.0],25.6));
	materials.push(new Material("Polished Bronze",[0.25,0.148,0.06475,1.0],[0.4,0.2368,0.1036,1.0],[0.774597,0.458561,0.200621,1.0],76.8));
}

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

function getMaterialByIndex(index){
	if(index >= materials.length)
		index = materials.length - 1;
	if(index < 0)
		index = 0;
	return materials[index];
}

/*Funcion para cargar los sliders de la pagina*/
function cargarSliders(){
	for(let i=1; i<5; i++){
		slider[i]=document.getElementById("slider"+(i));//Guardo el slider
		angle[i]=parseFloat(slider[i].defaultValue);//Actualizo el valor del angulo asociado al slider
		updateTextInput(i,slider[i].value);//Actualizo el valor del campo de texto asociado al slider
	}
	angle[2] = 91-slider[2].defaultValue; //Este es el angulo del slider del zoom
	//Debo cargarlo asi para que cuando aumente se acerque, y cuando disminuye se aleje
}


function onSliderLuz(slider){
	angle[1] = parseFloat(slider.value);
	changed = true;
	updateTextInput(1,slider.value);
}

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
		if(num==4){
			slider4.value=value;
			onSliderZoomCamera(slider4);
		}
		if(num==5){
			slider5.value=value;
			onSliderUpDownCamera(slider5);
		}
		if(num==6){
			slider6.value=value;
			onSliderRotationCamera(slider6);
		}
	}
}

/*Funcion usada para animar*/
/*Funcionamiento: Se pasa al metodo un indice, el cual indica que boton se ha pulsado
y que accion debe llevar a cabo...
*/
function animateObject(index){
	changed=true; //Activo que hubo un cambio
	if(!animated[index]){ //Si no estaba siendo animado...
		animated[index]=true; //Lo animo
		rotationAngle[index] = parseFloat(angle[index]); //Tomo el valor del angulo correspondiente y lo asigno al angulo de rotacion automatica
		if(index==5){//Si se trata de la rotacion automatica de la camara antihorario
			if(animated[6])//Si estaba rotando automaticamente horario
				animateObject(6);//Termino la animacion anterior
			rotationAngle[5]=parseFloat(angle[5]); //Tomo el angulo del slider 5
		}
		if(index==6){ //Si se trata de la rotacion automatica de la camara horario
			if(animated[5])//Si estaba rotando automaticamente antihorario
				animateObject(5);//Termino la animacion anterior
			rotationAngle[6]=parseFloat(angle[5]); //Tomo el angulo del slider 5
		}
	}
	else { //Si ya se encontraba animandose, deseo pararlo
		animated[index]=false; //Termino la animacion
	//Tengo que hacer un caso especial en el 6 porque comparte el slider 5 y no existe slider 6, por lo tanto el caso general falla.
		if(index==6){ //Si se trata de la rotacion automatica de la camara a la derecha
			slider[5].value=rotationAngle[6]; //Seteo el valor del slider 5 como el angulo de rotacion 6
			angle[5] = rotationAngle[6]; //Hago lo mismo con el angulo
			updateTextInput(6,rotationAngle[6]); //Y con el campo de texto
		}else{
			if(index==7){
				slider[0].value = rotationAngle[7];
				angle[0] = rotationAngle[7];
				updateTextInput(1,rotationAngle[7]);
			}
			else{ //Sino, en el caso general....
				slider[index].value=rotationAngle[index]; //Asigno al slider asociado con el valor de rotacion asociado
				angle[index]=rotationAngle[index]; //Lo mismo con el angulo
				updateTextInput(index+1,rotationAngle[index]); //Lo mismo con el campo de texto
			}
		}
	}
}

/*Funcion para resetear la escena.*/
function resetScene(){
	if(changed){ //Si ha habido algun cambio...
		//El 6 esta afuera porque es un caso especial.Corresponde a la rotacion de la camara automatica a la derecha
		//animated[6]=false; //Seteo todas las animaciones en falso
		//rotationAngle[6]=slider[5].defaultValue; //Seteo los valores de los angulos a los iniciales de cada slider
		for(let x=1; x<5; x++){
			animated[x]=false;
			rotationAngle[x]=slider[x].defaultValue;
			angle[x]=slider[x].defaultValue;
			updateTextInput(x,slider[x].defaultValue);
			if(slider[x]!=null)
				slider[x].value=slider[x].defaultValue;
		}
		//El 3 tambien. Corresponde al zoom
		angle[2]= 91-slider[2].defaultValue;
		changed=false;//Marco que no hay ningun cambio
		updateTextInput(2,slider[2].defaultValue);
	}
	console.log("RESET");//Escribo un RESET para avisar que hizo algo
}

/*Funcion usada para poner en pantalla completa*/
function launchFullScreen(element) {
	if(!fullScreen){ //Si no esta en pantalla completa...
		if(element.requestFullScreen) //Opcion estandar
			element.requestFullScreen();
		else
			if(element.mozRequestFullScreen) //Opcion para Gecko (Firefox)
				element.mozRequestFullScreen();
			else
				if(element.webkitRequestFullScreen) //Opcion para Blink (Chrome,Opera,Edge)
					element.webkitRequestFullScreen();
		fullScreen=true; //Esta en pantalla completa
	}
	else{ //Si estaba en pantalla completa
		if(document.cancelFullScreen)
			document.cancelFullScreen();
		else
			if(document.mozCancelFullScreen)
				document.mozCancelFullScreen();
			else
				if(document.webkitCancelFullScreen)
					document.webkitCancelFullScreen();
	 fullScreen=false; //Ya no lo esta
	}
}
