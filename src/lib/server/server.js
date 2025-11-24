const express = require('express');
const mongoose = require ('mongoose');
const cors = require('cors');
const {PORT,MONGO_URI} = require ('./config.js')
const routes = require('./routes/routes.js')

const app = express();

/*app.use(cors({
  origin: [
    'https://dimitri-lazarevic.fr',
    'http://localhost:5173'  // Pour le dev local
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // Si vous utilisez des cookies
}));
app.options('*', cors());*/

const allowed = [
  'https://dimitri-lazarevic.fr',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use(express.json());
app.use('/api',routes);
app.listen(PORT,()=>console.log("Connecté au port "+PORT+" capitaine !"))

mongoose
    .connect(MONGO_URI)
    .then(
        ()=>console.log("DB opérationnelle captain !"),
        ()=>console.log("La connexion à la DB a échoué !")
    )
