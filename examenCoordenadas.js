//La clase base Orden desde la cual heredan parámetros 
class Orden{
    //constructor que inicializa los siguientes parámetros
    constructor(id,coordenadas,prioridad,hora){
        //comprobaciones para verificar si la hora está dentro de los rangos permitidos
        let comprobacion = hora.split(':');
        try {

            //Si la longitud del valor de hora no es el indicado, da error
            if (comprobacion.length !== 2) {
                throw new Error("El formato de la hora debe ser HH:MM");
            }

            let horas = parseInt(comprobacion[0]);
            let minutos = parseInt(comprobacion[1]);
            
            //en caso de que el valor de horas o minutos no sea un número, da error
            if (isNaN(horas) || isNaN(minutos)) {
                throw new Error("Las horas y los minutos deben ser números válidos.");
            }

            //Si las horas o los minutos no están dentro de los parámetros establecidos, da error
            if (horas >= 1 && horas <= 12) {
                throw new Error("Las horas deben estar entre 1 y 12");
            }
    
            if (minutos >= 0 && minutos <= 59) {
                throw new Error("Los minutos deben estar entre 0 y 59");
            }
    
        } catch (err) {
            console.log(`Error en la hora: ${err.message}`);
            return; 
        }
        this.id = id;
        this.coordenadas = coordenadas;
        this.prioridad = prioridad;
        this.hora = hora;
    }

    //método con el cual se calcula la diferencia entre unas coordenadas y otras pasadas por parámetro
    calcularDistancia(otraOrden){
        const distanciaX = this.coordenadas[0] - otraOrden.coordenadas[0];
        const distanciaY = this.coordenadas[1] - otraOrden.coordenadas[1];
        return Math.sqrt(distanciaX*distanciaX + distanciaY*distanciaY);
    }
}

//Subclase de la clase Orden, hereda todos los parametros de la clase padre y agrega el parámetro propina
class OrdenPrioridad extends Orden{
    constructor(id,coordenadas,prioridad,hora,propina){
        super(id,coordenadas,prioridad,hora);
        this.propina = propina;
    }
}

//Subclase de la clase Orden, hereda los parámetros id, coordenadas, prioridad y hora, aunque el parámetro prioridad queda fijo en 1
class OrdenEstandar extends Orden{
    constructor(id,coordenadas,hora){
        super(id,coordenadas,1,hora);
    }
}

//Clase llamada SistemaEntregas el cual tiene el parámetro zonas el cual almacena todo
class SistemaEntregas{
    constructor(zonas){
        this.zonas = zonas;
    }

    //método que permite agregar nuevas zonas mediante los datos que recibe por parámetro tras realizar unas comprobaciones
    añadirZona(nombre,x,y){
        //Se comprueba que los parámetros x e y sea números y que el nombre no esté ya en la lista
        if(!isNaN(x) || !isNaN(y)){
            throw new Error("Las coordenadas de la zona deben ser números válidos");
        }
        if(this.zonas[nombre]){
            throw new Error("La zona ya existe");
        }
        // Si pasa las comprobaciones, se agrega la nueva zona con sus coordenadas y una lista de pedidos vacía
        this.zonas[nombre] = {
            centro: [x, y],  // Coordenadas del centro de la zona
            pedidos: []       // Lista vacía para almacenar los pedidos que lleguen a esa zona
        };
    }

    //Método que permite insertar una orden en su zona correspondiente
    insertarOrdenEnSuZona(orden){
        let zonaMasCercana = null;
        let distanciaMinima = Infinity;

        for(const nombreZona in this.zonas){
            const zona = this.zonas[nombreZona];
            const distancia = orden.calcularDistancia({coordenadas:zona.centro});
            if(distancia<distanciaMinima){
                zonaMasCercana = nombreZona;
                distanciaMinima = distancia;
            }
        }
        if(zonaMasCercana !==null){
             this.zonas[zonaMasCercana].pedidos.push(orden);
        }
    }

    mostrarPedidosPorZona(){
        for(const nombreZona in this.zonas){
            console.log(`Zona ${nombreZona}`);
            
            const pedidosPrioritarios = this.zonas[nombreZona].pedidos.filter(orden => orden.prioridad > 1)
                .sort((a, b) => b.prioridad - a.prioridad || a.hora.localeCompare(b.hora));

            const pedidosEstandar = this.zonas[nombreZona].pedidos.filter(orden => orden.prioridad === 1)
                .sort((a, b) => a.hora.localeCompare(b.hora));

            pedidosPrioritarios.forEach(orden=>{
                console.log(`-${orden.id} (Prioridad:${orden.prioridad},Propina:${orden.propina},Hora:${orden.hora})`);
            });

            pedidosEstandar.forEach(orden=>{
                console.log(`-${orden.id}(Hora:${orden.hora})`);
            });
        }
    }
}

const sistema = new SistemaDePedidos();


sistema.añadirZona("Centro", 0, 0);
sistema.añadirZona("Norte", 0, 10);
sistema.añadirZona("Sur", 10, 0);

// Órdenes prioritarias
const orden1 = new OrdenPrioridad("ORD-001", [0, 2], 3, "10:00", 4);//El tercer dato es la prioridad, luego va la hora y por último la propina
const orden2 = new OrdenPrioridad("ORD-002", [0, 3], 4, "12:00", 6); 

// Órdenes estándar
const orden3 = new OrdenEstandar("ORD-003", [0, 5], "08:20"); 
const orden4 = new OrdenEstandar("ORD-004", [0, 5], "09:10");
const orden5 = new OrdenEstandar("ORD-005", [10, 1], "11:00"); 
const orden6 = new OrdenEstandar("ORD-006", [10, 2], "07:50"); 


sistema.insertarOrdenEnSuZona(orden1);
sistema.insertarOrdenEnSuZona(orden2);
sistema.insertarOrdenEnSuZona(orden3);
sistema.insertarOrdenEnSuZona(orden4);
sistema.insertarOrdenEnSuZona(orden5);
sistema.insertarOrdenEnSuZona(orden6);


sistema.mostrarPedidosPorZona();


