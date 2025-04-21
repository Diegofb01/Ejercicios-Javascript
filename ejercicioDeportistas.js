// Clase abstracta Deportista
class Deportista {
    constructor(nombre, añoNacimiento) {
        this.nombre = nombre;                  
        this.añoNacimiento = añoNacimiento;  
        this.marcas = [];                      
        this.disciplina = null;                
    }

    // Método abstracto (polimórfico)
    obtenerMejorMarca() {
        throw new Error("Este método debe ser implementado en una subclase.");
    }

    // Método abstracto para ordenar marcas
    marcasOrdenadas() {
        throw new Error("Este método debe ser implementado en una subclase.");
    }

    // Método abstracto para añadir marcas con validación
    añadirMarca(...marcas) {
        throw new Error("Este método debe ser implementado en una subclase.");
    }

    // Método abstracto para asignar disciplina válida
    añadirDisciplina(disciplina) {
        throw new Error("Este método debe ser implementado en una subclase.");
    }
}

// Subclase Atleta (usa tiempos)
class Atleta extends Deportista {
    constructor(nombre, añoNacimiento) {
        super(nombre, añoNacimiento); // Llama al constructor de Deportista
    }

    añadirDisciplina(disciplina) {
        const disciplinasValidas = ["100 metros lisos", "200 metros lisos", "200 metros vallas"];
        if (disciplinasValidas.includes(disciplina)) {
            this.disciplina = disciplina;
        } else {
            console.error("Disciplina no válida para Atleta.");
        }
    }

    añadirMarca(...marcas) {
        let añadidas = 0;
        let rechazadas = 0;

        marcas.forEach(marca => {
            let intentos = 0;
            while (intentos < 3) {
                if (typeof marca === "number" && marca > 0 && marca < 60) {
                    this.marcas.push(marca);
                    añadidas++;
                    break;
                } else {
                    intentos++;
                    if (intentos === 3) {
                        console.warn(`Marca inválida para Atleta: ${marca}`);
                        rechazadas++;
                    }
                }
            }
        });

        console.log(`${this.nombre}: ${añadidas} marcas añadidas, ${rechazadas} rechazadas.`);
    }

    obtenerMejorMarca() {
        const mejor = Math.min(...this.marcas);
        return `${mejor} segundos`;
    }

    marcasOrdenadas() {
        return this.marcas.slice().sort((a, b) => a - b).map(m => `${m} segundos`);
    }
}

// Subclase Lanzador (usa distancias)
class Lanzador extends Deportista {
    constructor(nombre, añoNacimiento) {
        super(nombre, añoNacimiento);
    }

    añadirDisciplina(disciplina) {
        const disciplinasValidas = ["jabalina", "peso"];
        if (disciplinasValidas.includes(disciplina)) {
            this.disciplina = disciplina;
        } else {
            console.error("Disciplina no válida para Lanzador.");
        }
    }

    añadirMarca(...marcas) {
        let añadidas = 0;
        let rechazadas = 0;

        marcas.forEach(marca => {
            let intentos = 0;
            while (intentos < 3) {
                if (typeof marca === "number" && marca > 0) {
                    this.marcas.push(marca);
                    añadidas++;
                    break;
                } else {
                    intentos++;
                    if (intentos === 3) {
                        console.warn(`Marca inválida para Lanzador: ${marca}`);
                        rechazadas++;
                    }
                }
            }
        });

        console.log(`${this.nombre}: ${añadidas} marcas añadidas, ${rechazadas} rechazadas.`);
    }

    obtenerMejorMarca() {
        const mejor = Math.max(...this.marcas);
        return `${mejor} metros`;
    }

    marcasOrdenadas() {
        return this.marcas.slice().sort((a, b) => b - a).map(m => `${m} metros`);
    }
}

// Clase EquipoOlimpico que gestiona a los deportistas
class EquipoOlimpico {
    constructor(procedencia) {
        this.procedencia = procedencia;   // País del equipo
        this.deportistas = [];            // Lista de deportistas
    }

    // Agrega un deportista al equipo
    añadirDeportista(deportista) {
        this.deportistas.push(deportista);
    }

    // Muestra mejor marca de cada deportista
    mostrarMejoresMarcasDeCadaDeportista() {
        console.log("▶ Mejores marcas de cada deportista:");
        this.deportistas.forEach(dep => {
            console.log(`${dep.nombre} (${dep.disciplina}): ${dep.obtenerMejorMarca()}`);
        });
    }

    // Muestra mejor marca por disciplina
    mostrarMejoresMarcasPorDisciplina() {
        console.log("\n🏅 Mejores marcas por disciplina:");
        const mejores = {};

        this.deportistas.forEach(dep => {
            if (!dep.disciplina) return;

            const actual = mejores[dep.disciplina];
            if (!actual) {
                mejores[dep.disciplina] = dep;
            } else {
                const nuevoEsMejor = dep instanceof Atleta
                    ? Math.min(...dep.marcas) < Math.min(...actual.marcas)
                    : Math.max(...dep.marcas) > Math.max(...actual.marcas);

                if (nuevoEsMejor) {
                    mejores[dep.disciplina] = dep;
                }
            }
        });

        for (const disc in mejores) {
            const dep = mejores[disc];
            console.log(`Disciplina: ${disc}, Mejor: ${dep.nombre}, Marca: ${dep.obtenerMejorMarca()}`);
        }
    }
}

const equipo = new EquipoOlimpico("España");


const atleta1 = new Atleta("Sofía", 1998);
const atleta2 = new Atleta("Pedro", 2000);
const atleta3 = new Atleta("Lucía", 1997);
const lanzador1 = new Lanzador("Marcos", 1995);
const lanzador2 = new Lanzador("Elena", 1992);
const lanzador3 = new Lanzador("Iván", 1990);

atleta1.añadirDisciplina("100 metros lisos");
atleta2.añadirDisciplina("200 metros lisos");
atleta3.añadirDisciplina("200 metros vallas");
lanzador1.añadirDisciplina("jabalina");
lanzador2.añadirDisciplina("peso");
lanzador3.añadirDisciplina("jabalina");


atletatleta1.añadirMarca(11.2, 10.8, 10.95);
atleta2.añadirMarca(21.4, 21.1);
atleta3.añadirMarca(24.3, 24.0, 23.9);
lanzador1.añadirMarca(62.5, 64.3);
lanzador2.añadirMarca(20.1, 19.7);
lanzador3.añadirMarca(65.1, 66.3);

equipo.añadirDeportista(atleta1);
equipo.añadirDeportista(atleta2);
equipo.añadirDeportista(atleta3);
equipo.añadirDeportista(lanzador1);
equipo.añadirDeportista(lanzador2);
equipo.añadirDeportista(lanzador3);

console.log("🎽 EQUIPO OLÍMPICO -", equipo.procedencia);
equipo.mostrarMejoresMarcasDeCadaDeportista();
equipo.mostrarMejoresMarcasPorDisciplina();

console.log(`Marcas ordenadas de ${atleta1.nombre}:`, atleta1.marcasOrdenadas());
console.log(`Lanzamientos ordenados de ${lanzador1.nombre}:`, lanzador1.marcasOrdenadas());
