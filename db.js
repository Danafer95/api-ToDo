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
    return new Promise( async (ok,ko) => {
        try{
            const conexion = conectar();
            let tareas = await conexion`SELECT * FROM tareas`;
            conexion.end();

            ok(tareas);
        }catch(err){
            ko({error : "error en el servidor"});
        }
    });
}

module.exports = {tareas};