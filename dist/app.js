"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importamos dependencias
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
//Importamos fichero de rutas
const userCreated_routes_1 = __importDefault(require("./routes/userCreated.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const entrada_routes_1 = __importDefault(require("./routes/entrada.routes"));
const rol_routes_1 = __importDefault(require("./routes/rol.routes"));
const cliente_routes_1 = __importDefault(require("./routes/cliente.routes"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./middlewares/passport"));
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon'); //Serve Favicon for webpage
//Starting Express
const app = express_1.default();
//Configuration
//Setting Port as Environment Provided else using 3000
app.set('port', process.env.PORT || 3000);
app.use(cors()); //Allow CORS!
app.use(express_1.default.static('views'));
//middlewares
app.use(morgan_1.default('dev'));
//*******************************KRUNAL**************************************/
app.use(cookieParser());
//For Public Folder such as WebPage and Etc...
app.use(express_1.default.static(path.join(__dirname, "../dist/public")));
//For Serving Images could be any big image...
app.use('/images', express_1.default.static(path.join(__dirname, "../dist/images")));
//For Serving Favicon shown on webtabs 16x16 px
app.use(favicon(path.join(__dirname, "../dist/public", "/favicon.ico")));
//Against deprectaction warning of bodyparser 
app.use(express_1.default.urlencoded({ extended: true }));
// parse application/json
app.use(express_1.default.json());
//Passport JWT
app.use(passport_1.default.initialize());
passport_1.default.use(passport_2.default);
//*******************************KRUNAL**************************************/
//API Routes
app.use('/auth', auth_routes_1.default);
app.use('/userCreated', userCreated_routes_1.default);
app.use('/entradas', entrada_routes_1.default);
app.use('/rols', rol_routes_1.default);
app.use('/clientes', cliente_routes_1.default);
// Middleware to catch 404 errors
app.use(function (req, res, next) {
    res.status(404).sendFile(path.join(__dirname, "../dist/public", '/views', '/404.html'));
});
//Exportamos fichero como 'app'
exports.default = app;
