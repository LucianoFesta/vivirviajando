const express = require('express');
const path = require('path');
const dotenv = require("dotenv").config();  //npm i dotenv
const methodOverride = require('method-override'); 
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cookieCheck = require('./middleware/users/cookieCheck');

//Rutas Main
const mainRoutes = require('./routes/mainRoutes');

//Rutas Users
const usersRoutes = require('./routes/usersRoutes');

//Rutas Products
const productsRoutes = require('./routes/productsRoutes');

//Rutas admin
const adminRoutes = require('./routes/adminRoutes');

const app = express();

//Indicamos a express cual es el motor de plantillas a utilizar
app.set('view engine', 'ejs');

app.set('views', [
    path.join(__dirname,'./views/mainViews'),
    path.join(__dirname,'./views/productsViews'),
    path.join(__dirname,'./views/usersViews'),
    path.join(__dirname,'./views/adminViews')
]);

//Declaramos donde estan los archivos estaticos
app.use(express.static('public'));

//Uso de session
app.use(session({
    secret: 'shhhh es un secreto',
    resave: false,
    saveUninitialized: false
}));

//Uso cookies
app.use(cookieParser());
app.use(cookieCheck);

//Acceso al req.body y enviar y recibir archivos en formato JSON
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Uso del method PUT y DELETE
app.use(methodOverride('_method'));

//Use Rutas
app.use('/', mainRoutes);
app.use('/users', usersRoutes);
app.use('/products', productsRoutes);
app.use('/admin', adminRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});