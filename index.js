require("dotenv").config();

const express = require("express");
const {json} = require("body-parser");
const cors = require("cors");
const {tareas,crearTarea,borrarTarea,toggleEstado,editarTexto} = require("./db");

const servidor = express();

servidor.use(cors());

servidor.use(json());

if(process.env.LOCAL){
    servidor.use(express.static("./pruebas"));
}

servidor.get("/tareas", async (peticion,respuesta) => {
    try{
        let resultado = await tareas();

        respuesta.json(resultado);

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.post("/tareas/nueva", async (peticion,respuesta, siguiente) => {
   if(!peticion.body.tarea || peticion.body.tarea.trim() == ""){
        return siguiente(true);
   }

   try{
        let id = await crearTarea(peticion.body.tarea);
        respuesta.json({id});

   }catch{
        respuesta.status(500);
        respuesta.json(error);
   }
   
});

servidor.delete("/tareas/borrar/:id([0-9]+)", async (peticion,respuesta)=>{
    try{

        let count = await borrarTarea(peticion.params.id);
        respuesta.json({resultado : count ? "ok" : "ko"});

   }catch{
        respuesta.status(500);
        respuesta.json(error);
   }
    
});

servidor.put("/tareas/actualizar/:id([0-9]+)/:operacion(1|2)", async (peticion,respuesta,siguiente) => {
    let operacion = Number(peticion.params.operacion);
    let funciones = [editarTexto,toggleEstado];

    if(operacion == 1 && (!peticion.body.tarea || peticion.body.tarea.trim() == "")){
        return siguiente(true);
    }

    try{
        let count = await funciones[operacion - 1](peticion.params.id, operacion == 1 ? peticion.body.tarea : null);

        respuesta.json({ resultado : count ? "ok" : "ko" });

    }catch(error){
        respuesta.status(500);

        respuesta.json(error);
    }

});

/* MI SOLUCION FALTA EL ENVIO DEL ERROR
servidor.put("/tareas/actualizar/:id([0-9]+)/:operacion([1-2])",  async (peticion,respuesta)=>{

    if(peticion.params.operacion == 1 && (!peticion.body.tarea || peticion.body.tarea.trim() == "")){
        return siguiente(true);
   }

    try{
        if(peticion.params.operacion == 2){
            let count = await toggleEstado(peticion.params.id);
            respuesta.json({resultado : count ? "ok" : "ko"});
        }else{
                       
            let count = await editarTexto(peticion.params.id, peticion.body.tarea);
            respuesta.json({resultado : count ? "ok" : "ko"});
           
        }

    }catch(error){
            respuesta.status(500);
            respuesta.json(error);
    }
    
   //respuesta.send(` el id: ${peticion.params.id} y la operación sera ${peticion.params.operacion}`);
    
}); */


servidor.use((error,peticion,respuesta,siguiente) => {
    
    respuesta.status(400);
    respuesta.json({ error : "error en la petición"});
});


servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "recurso no encontrado" });
});


servidor.listen(process.env.PORT);