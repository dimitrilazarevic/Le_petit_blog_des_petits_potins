const express = require('express');
const mongoose = require ('mongoose');
const cors = require('cors');
const {PORT,MONGO_URI} = require ('./config.js')
const routes = require('./routes/routes.js')

const app = express();
app.use(express.json());
app.use('/api',routes);
app.listen(PORT,()=>console.log("Connecté au port "+PORT+" capitaine !"))

mongoose
    .connect(MONGO_URI)
    .then(
        ()=>console.log("DB opérationnelle capitaine !")
    )
