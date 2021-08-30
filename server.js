const express = require ('express');
const connectDB = require ("./config/db")
const bodyParser = require('body-parser')
const cors = require ('cors');

const app = express();

connectDB();

app.use(bodyParser.json({ extended: false }))

// let corsOptionsDelegate = (req, callback) => {
//     let corsOptions;
//     let allowedOrigins = [
//         'http://localhost:3000/',
//      ];
//     if (allowedOrigins.indexOf(req.header('Origin')) !== -1) {
//         corsOptions = {
//             credentials: true,
//             origin: true
//         };
//     } else {
//         corsOptions = {
//             origin: false
//         };
//     }
//     callback(null, corsOptions);
// };
app.use(cors());


app.get('/', (req, res)=> res.send('api running '))

//define routes 

app.use('/api/user', require('./routes/api/user'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/salon', require('./routes/api/salon'))
app.use('/api/salonAuth', require('./routes/api/salonAuth'))


const PORT =  5000;

app.listen(PORT, ()=> {console.log('server connected ')});