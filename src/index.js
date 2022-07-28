const express = require('express');
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const morgan = require('morgan');
const path = require('path');
const app = express();
require('dotenv').config({path: 'src/.env'});
const port = process.env.PORT || 3000;
const appRoutes = require('./routes/app.routes');
const uri = `mongodb+srv://${process.env.DUSER}:${process.env.DPASSWORD}@cluster0.ueefu.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).catch((e) => console.error(e));
app.use(morgan('dev'));
app.use(session({resave: true, saveUninitialized: true, secret: 'secret'}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/', appRoutes);
app.listen(port , ()=> console.log('> Server is up and running on port : ' + port));