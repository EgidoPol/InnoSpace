//Configuraciones para conexion con BBDD
export default {
    jwtSecret: process.env.JWT_SECRET || 'innovasecrettoken',
    expirationTime: 5,
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb+srv://innova:Seguiment2024@seguimentinnova.acgkrzs.mongodb.net/InnovaSpace',
        USER: process.env.MONGODB_USER,
        PASSWORD: process.env.MONGODB_PASSWORD
    }
}