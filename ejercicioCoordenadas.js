//Clase principal desde lka cual obtienen parámetros las subclases
class Orden {
    constructor(id, coordenadas, hora) {
        //comprobaciones de errores para las horas
        try {
            const horaParts = hora.split(":");
            if (horaParts.length !== 2) {
                throw new Error("El formato de la hora es incorrecto. Debe ser HH:MM");
            }

            const [horas, minutos] = horaParts.map(Number);

            if (isNaN(horas) || isNaN(minutos)) {
                throw new Error("Las horas y los minutos deben ser números.");
            }
            if (horas < 0 || horas > 12) {
                throw new Error("La hora debe estar entre 00 y 12.");
            }
            if (minutos < 0 || minutos > 59) {
                throw new Error("Los minutos deben estar entre 00 y 59.");
            }

            this.id = id;
            this.coordenadas = coordenadas;
            this.hora = hora;
            this.prioridad = 1; 
        } catch (error) {
            console.error(`Error en la hora: ${error.message}`);
        }
    }

    //método que sirve para calcular la diferencia entre diferentes coordenadas devolviendo la distancia eucladiana entre ambas
    calcularDistancia(otraOrden) {
        const distanciaX = this.coordenadas[0] - otraOrden.coordenadas[0];
        const distanciaY = this.coordenadas[1] - otraOrden.coordenadas[1];
        return Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY); 
    }
}

//Subclase que hereda de la clase Orden los diferentes parámetros
class OrdenPrioridad extends Orden {
    constructor(id, coordenadas, prioridad, hora, propina) {
        super(id, coordenadas, hora);
        //Comprueba si el valor del parámetro prioridad es válido
        if (prioridad < 1 || prioridad > 5) {
            throw new Error("La prioridad debe estar entre 1 y 5");
        }
        this.prioridad = prioridad;  
        this.propina = propina; 
    }
}

//Subclase que hereda los parámetros de la clase Orden
class OrdenEstandar extends Orden {
    constructor(id, coordenadas, hora) {
        super(id, coordenadas, hora);
        this.prioridad = 1;  
    }
}

//Clase principal que crea el objeto Zonas y que realiza métodos que emplean tanto la clase Orden como sus subclases como el parámetro Zona
class SistemaEntregas {
    constructor() {
        this.zonas = {};  
    }

    añadirZona(nombre, x, y) {
        if (this.zonas[nombre]) {
            throw new Error("La zona con este nombre ya existe");
        }
        if (isNaN(x) || isNaN(y)) {
            throw new Error("Las coordenadas deben ser números");
        }
        this.zonas[nombre] = {
            centro: [x, y],
            pedidos: []  
        };
    }

    insertarOrdenEnSuZona(orden) {
        let zonaCercana = null;
        let distanciaMinima = Infinity;

        for (const zona in this.zonas) {
            const distancia = orden.calcularDistancia({
                coordenadas: this.zonas[zona].centro
            });
            if (distancia < distanciaMinima) {
                zonaCercana = zona;
                distanciaMinima = distancia;
            }
        }
        if (zonaCercana) {
            this.zonas[zonaCercana].pedidos.push(orden);
        } else {
            throw new Error("No se pudo asignar la orden a ninguna zona");
        }
    }

//Método que muestra los pedidos por zona y los ordena por pedidosPrioritarios y pedidosEstandar
    mostrarPedidosPorZona() {
        for (const zona in this.zonas) {
            console.log(`Zona "${zona}":`);

            const pedidos = this.zonas[zona].pedidos;
            const pedidosPrioritarios = pedidos.filter(orden => orden.prioridad > 1).sort((a, b) => b.prioridad - a.prioridad || a.hora.localeCompare(b.hora));
            const pedidosEstandar = pedidos.filter(orden => orden.prioridad === 1).sort((a, b) => a.hora.localeCompare(b.hora));


            pedidosPrioritarios.forEach(orden => {
                console.log(`- ${orden.id} (Prioridad: ${orden.prioridad}, Propina: ${orden.propina}, Hora: ${orden.hora})`);
            });

            pedidosEstandar.forEach(orden => {
                console.log(`- ${orden.id} (Hora: ${orden.hora})`);
            });
        }
    }
}

//Pruebas
const sistema = new SistemaEntregas();
sistema.añadirZona("Centro", 0, 0);
sistema.añadirZona("Norte", 0, 10);


const orden1 = new OrdenPrioridad("ORD-001", [0, 2], 3, "10:00", 4);  
const orden2 = new OrdenPrioridad("ORD-002", [0, 3], 4, "12:00", 6);  
const orden3 = new OrdenEstandar("ORD-003", [0, 5], "08:20");  
const orden4 = new OrdenEstandar("ORD-004",[0,12],"09:25");
const orden5 = new OrdenPrioridad("ORD-005",[0,13],4,"10:15",3);


sistema.insertarOrdenEnSuZona(orden1);
sistema.insertarOrdenEnSuZona(orden2);
sistema.insertarOrdenEnSuZona(orden3);
sistema.insertarOrdenEnSuZona(orden4);
sistema.insertarOrdenEnSuZona(orden5);

sistema.mostrarPedidosPorZona();
