import mongoose from "mongoose";

mongoose.connect("mongodb+srv://edward:Andreige9497@cluster0.ettfr.mongodb.net/tfg")
    .then(() => console.log("Base de datos conectada"))
    .catch(error => console.log(`Error al conectarse a la base de datos. Error: ${error}`))