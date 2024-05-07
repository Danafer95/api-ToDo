require("dotenv").config();

const postgres = require("postgres");

function conectar(){
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
    });
}

function tareas(){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = conectar();

            let tareas = await conexion`SELECT * FROM tareas`;

            conexion.end();

            ok(tareas);

        }catch(error){

            ko({ error : "error en el servidor" });

        }
    });
}

function crearTarea(tarea){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = conectar();

            let [{id}] = await conexion`INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id`;

            conexion.end();

            ok(id);

        }catch(error){

            ko({ error : "en la BBDD" });

        }
    });
}

/*
tareas()
.then( x => console.log(x))
.catch( x => console.log(x));

crearTarea("Cortar los arboles")
.then( x => console.log(x))
.catch( x => console.log(x));*/

module.exports = {tareas, crearTarea};