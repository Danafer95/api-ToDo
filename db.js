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


function borrarTarea(id){
    return new Promise(async (ok,ko) =>{
        const conexion = conectar();

        try{
            
            let {count} = await conexion`DELETE FROM tareas WHERE id = ${id}`;
            conexion.end();
            ok(count);

        }catch(error){
            ko({ error : "error en BBDD"});
        }

    });
}

function toggleEstado(id){
    return new Promise(async (ok,ko) =>{
        const conexion = conectar();

        try{
            
            let {count} = await conexion`UPDATE tareas SET terminada = NOT terminada WHERE id = ${id}`;
            conexion.end();
            ok(count);

        }catch(error){
            ko({ error : "error en BBDD"});
        }

    });
}

function editarTexto(id, tarea){
    return new Promise(async (ok,ko) =>{
        const conexion = conectar();

        try{
            
            let {count} = await conexion`UPDATE tareas SET tarea = ${tarea} WHERE id = ${id}`;
            conexion.end();
            ok(count);

        }catch(error){
            ko({ error : "error en BBDD"});
        }

    });
}



/*

editarTexto(5, "integrar front y back")
.then( x => console.log(x))
.catch( x => console.log(x));

borrarTarea(2)
.then( x => console.log(x))
.catch( x => console.log(x));

tareas()
.then( x => console.log(x))
.catch( x => console.log(x));

crearTarea("Cortar los arboles")
.then( x => console.log(x))
.catch( x => console.log(x));*/

module.exports = {tareas, crearTarea, borrarTarea, toggleEstado, editarTexto};