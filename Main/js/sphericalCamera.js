// import { mat4, quat } from "/libs/gl-matrix/index.js"
// import { toRadians, limitToRange } from "/libs/utils.js"

const DEFAULT_RADIUS = 3               // distancia al origen
const DEFAULT_THETA  = glMatrix.toRadian(51.37509871)    // angulo horizontal alrededor del eje y (partiendo del eje z positivo, en sentido anti-horario)
const DEFAULT_PHI    = glMatrix.toRadian(72.08721586)    // angulo vertical desde el eje y positivo

class sphericalCamera {

    constructor() {
        this.sphericalPosition = { radius: DEFAULT_RADIUS, theta: DEFAULT_THETA, phi: DEFAULT_PHI }
        this.fov    = 45
        this.aspect = 1300/700
        this.near   = 0.1
        this.far    = 100

        this.onPositionChange = () => {} // funcion que se ejecuta ante cada cambio en la posicion de la camara (por defecto una "funcion vacia" o no-op)

        this.viewMatrix = mat4.create()
        this.projectionMatrix = mat4.create()

        this.updateViewMatrix()
        this.updateProjectionMatrix()
    }

    // Setters & Getters

    set radius(value) {
        this.sphericalPosition.radius = limitToRange(value, this.near, this.far) // radius: [near, far]
        this.updateViewMatrix()
        this.onPositionChange(this.sphericalPosition)
    }
    get radius() {
        return this.sphericalPosition.radius
    }

    set theta(value) {
        this.sphericalPosition.theta = ( value === Math.PI * 2 ) ? value : ( value + Math.PI * 2 ) % ( Math.PI * 2 ) // theta: [0, 360]
        this.updateViewMatrix()
        this.onPositionChange(this.sphericalPosition)
    }
    get theta() {
        return this.sphericalPosition.theta
    }

    set phi(value) {
        this.sphericalPosition.phi = limitToRange(value, 0, Math.PI/2) // phi: [0, 180]
        this.updateViewMatrix()
        this.onPositionChange(this.sphericalPosition)
    }
    get phi() {
        return this.sphericalPosition.phi
    }

    // Actualizacion de matrices

    updateViewMatrix() {
        const angleAroundX = Math.PI / 2 - this.sphericalPosition.phi   // [0, 180] -> Â± [0, 90]
        const angleAroundY = - this.sphericalPosition.theta             // [0, 360] -> - [0, 360]

        const rotations = quat.create()                     // creamos un cuaternion 'identidad' (i.e. representa una rotacion nula)
        quat.rotateX(rotations, rotations, angleAroundX)    // en el que almacenamos la rotacion alrededor del eje x
        quat.rotateY(rotations, rotations, angleAroundY)    // y la rotacion alrededor del eje y

        const rotationMatrix = mat4.create()
        mat4.fromQuat(rotationMatrix, rotations)

        const translationMatrix = mat4.create()
        mat4.fromTranslation(translationMatrix, [0, 0, - this.sphericalPosition.radius])

        mat4.multiply(this.viewMatrix, translationMatrix, rotationMatrix)
    }

    updateProjectionMatrix() {
        mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far)
    }

    /* ðŸ“ Movimientos de camara
     Dolly in|out - Acerca|aleja a la camara de su objetivo (equivale a disminuir|aumentar el radio)
     Arco horizontal|vertical - Mueve a la camara alrededor de su objetivo en forma circular (equivale a modificar los valores de theta|phi)
     */

    dolly(value) {
        this.radius = this.radius - value
    }

    arcVertically(value) {
        this.phi = this.phi - value
    }

    arcHorizontally(value) {
        this.theta = this.theta + value
    }

    reset() {
        this.sphericalPosition = { radius: DEFAULT_RADIUS, theta: DEFAULT_THETA, phi: DEFAULT_PHI }
        this.onPositionChange(this.sphericalPosition)
        this.updateViewMatrix()
    }
}

// class sphericalCamera{
// 	constructor(theta,phi,r,center,up){
// 		this.theta=theta;
// 		this.phi=phi;
// 		this.r=r;
// 		this.center=center;
// 		this.up=up;
// 	}
//
// 	createViewMatrix(){
// 		let viewMatrix = mat4.create();
// 		this.eyePos=[this.r*Math.sin(this.theta)*Math.cos(this.phi),this.r*Math.cos(this.theta),this.r*Math.sin(this.theta)*Math.sin(this.phi)];
// 		viewMatrix = mat4.lookAt(viewMatrix,this.eyePos,this.center,this.up);
// 		return viewMatrix;
// 	}
// 	createPerspectiveMatrix(fov,near,far,aspect){
// 		this.fov=fov;
// 		this.near=near;
// 		this.far=far;
// 		this.aspect=aspect;
// 		let projMatrix = mat4.create();
// 		mat4.perspective(projMatrix, fov, aspect, near, far);
// 		return projMatrix;
// 	}
//
// 	zoom(r){
// 		let projMatrix = mat4.create();
// 		projMatrix = this.createPerspectiveMatrix(glMatrix.toRadian(r),this.near,this.far,this.aspect);
// 		return projMatrix;
// 	}
//
// 	getPosition(){
// 		return this.eyePos;
// 	}
// 	quaternionCamera(phi,theta){
// 		this.phi = phi;  // se actualizan el valor de phi de la camara
// 		this.theta = theta;
// 		const rotations = quat.create(); // se crea un cuaternion identidad.
// 		quat.rotateX(rotations,rotations,this.theta); // se guarda la rotación que se aplicará al objeto
// 		quat.rotateY(rotations,rotations,this.phi);
//
// 		const rotationMatrix = mat4.create(); // se crea una matriz de rotación
// 		mat4.fromQuat(rotationMatrix,rotations); // se convierte el cuaternion a matriz
//
// 		const translationMatrix = mat4.create(); // se crea una matriz de traslación
// 		mat4.fromTranslation(translationMatrix,[0,0,-this.r]); // se guarda la traslación que se aplicará al objeto
//
//
// 		let viewMatrix = mat4.create();  // se resetea la matriz de vista
// 		mat4.multiply(viewMatrix, translationMatrix, rotationMatrix); // se multiplica la matriz traslación a la de rotación
// 																	// y se la guarda en la matriz de vista.
// 		return viewMatrix;
// 	}
// }
