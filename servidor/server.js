const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

// Configuración de MongoDB Atlas
const uri = process.env.MONGODB_URI;
const dbName = 'skillforge';

// Conexión a la base de datos
let db;

const connectToMongoDB = async () => {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conexión exitosa a MongoDB');
        db = client.db(dbName);

        //Rutas y lógica de la API aquí
        // Ruta para obtener usuario actual
        app.get('/api/id_usuario_actual', async (req, res) => {
            try {
                const ID_Usuario = req.headers.authorization;
                const usuario = await db.collection('usuarios').findOne({ _id: new ObjectID(ID_Usuario) });
                if (usuario) {
                    res.json({ 'ID_Usuario_Actual': usuario._id });
                } else {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                }
            } catch (error) {
                console.error('Error al obtener el usuario actual:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });

        // Ruta para obtener todos los usuarios
        app.get('/api/usuarios', async (req, res) => {
            try {
                const usuarios = await db.collection('usuarios').find().toArray();
                res.json({ 'elementos': usuarios });
            } catch (error) {
                console.error('Error al obtener todos los usuarios:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });

        // Ruta para obtener un usuario por ID
        app.get('/api/usuarios/:ID_Usuario', async (req, res) => {
            try {
                const ID_Usuario = req.params.ID_Usuario;
                const usuario = await db.collection('usuarios').findOne({ _id: new ObjectID(ID_Usuario) });

                if (usuario) {
                    res.json({ 'elemento': usuario });
                } else {
                    res.status(404).json({ 'message': 'Elemento no encontrado' });
                }
            } catch (error) {
                console.error('Error al obtener el usuario por ID:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        });

        // Ruta para agregar un usuario
        app.post('/api/usuarios', async (req, res) => {
            try {
                const nuevoUsuario = req.body;
                if (!nuevoUsuario || Object.keys(nuevoUsuario).length === 0) {
                    res.status(400).json({ error: 'Datos de usuario no proporcionados' });
                    return;
                }
                const resultado = await db.collection('usuarios').insertOne(nuevoUsuario);
                if (resultado.insertedCount === 1) {
                    res.status(201).json({ 'message': 'Usuario agregado correctamente' });
                } else {
                    res.status(500).json({ 'error': 'Error al agregar el usuario' });
                }
            } catch (error) {
                console.error('Error al agregar un usuario:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });

        // Ruta para actualizar un usuario
        app.put('/api/usuarios/:ID_Usuario', async (req, res) => {
            try {
                const ID_Usuario = req.params.ID_Usuario;
                const usuarioActualizado = req.body;
                if (!usuarioActualizado || Object.keys(usuarioActualizado).length === 0) {
                    res.status(400).json({ error: 'Datos de usuario a actualizar no proporcionados' });
                    return;
                }
                const resultado = await db.collection('usuarios').updateOne(
                    { _id: new ObjectID(ID_Usuario) },
                    { $set: { 'ID_Estilo': usuarioActualizado.ID_Estilo } }
                );
                if (resultado.modifiedCount === 1) {
                    res.json({ 'message': 'Estilo de usuario actualizado correctamente' });
                } else {
                    res.status(404).json({ 'error': 'Usuario no encontrado o sin cambios' });
                }
            } catch (error) {
                console.error('Error al actualizar un usuario:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });

        // Ruta para agregar un consejo
        app.post('/api/consejo', async (req, res) => {
            try {
                const nuevoConsejo = req.body;
                if (!nuevoConsejo || Object.keys(nuevoConsejo).length === 0) {
                    res.status(400).json({ error: 'Datos del consejo no proporcionados' });
                    return;
                }
                const resultado = await db.collection('consejo').insertOne(nuevoConsejo);
                if (resultado.insertedCount === 1) {
                    res.status(201).json({ 'message': 'Consejo agregado correctamente' });
                } else {
                    res.status(500).json({ 'error': 'Error al agregar el consejo' });
                }
            } catch (error) {
                console.error('Error al agregar un consejo:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });


        // Ruta para obtener todos los consejos
        app.get('/api/consejo', async (req, res) => {
            try {
                const consejos = await db.collection('consejo').find().toArray();
                res.json({ 'elementos': consejos });
            } catch (error) {
                console.error('Error al obtener todos los consejos:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });

        // Ruta para eliminar un consejo
        app.delete('/api/consejo/:ID_Consejo', async (req, res) => {
            try {
                const ID_Consejo = req.params.ID_Consejo;
                if (!ObjectID.isValid(ID_Consejo)) {
                    res.status(400).json({ 'error': 'ID de consejo no válido' });
                    return;
                }

                await db.collection('consejo').deleteOne({ _id: new ObjectID(ID_Consejo) });
                res.json({ 'message': 'Consejo eliminado correctamente' });
            } catch (error) {
                console.error('Error al eliminar un consejo:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });

        // Ruta para eliminar un consejo
        app.delete('/api/consejo/:ID_Consejo', async (req, res) => {
            try {
                const ID_Consejo = req.params.ID_Consejo;
                if (!ObjectID.isValid(ID_Consejo)) {
                    res.status(400).json({ 'error': 'ID de consejo no válido' });
                    return;
                }

                await db.collection('consejo').deleteOne({ _id: new ObjectID(ID_Consejo) });
                res.json({ 'message': 'Consejo eliminado correctamente' });
            } catch (error) {
                console.error('Error al eliminar un consejo:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });

        // Ruta para agregar un ejercicio
        app.post('/api/ejercicio', async (req, res) => {
            try {
                const nuevoEjercicio = req.body;
                if (!nuevoEjercicio || Object.keys(nuevoEjercicio).length === 0) {
                    res.status(400).json({ error: 'Datos del ejercicio no proporcionados' });
                    return;
                }

                // Insertar el nuevo ejercicio en la base de datos
                const resultado = await db.collection('ejercicio').insertOne(nuevoEjercicio);
                if (resultado.insertedCount === 1) {
                    res.status(201).json({ 'message': 'Ejercicio agregado correctamente' });
                } else {
                    res.status(500).json({ 'error': 'Error al agregar el ejercicio' });
                }
            } catch (error) {
                console.error('Error al agregar un ejercicio:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });

        // Ruta para obtener todos los ejercicios
        app.get('/api/ejercicio', async (req, res) => {
            try {
                const ejercicios = await db.collection('ejercicio').find().toArray();
                res.json({ 'elementos': ejercicios });
            } catch (error) {
                console.error('Error al obtener todos los ejercicios:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });


        // Ruta para eliminar un ejercicio
        app.delete('/api/ejercicio/:ID_Ejercicio', async (req, res) => {
            try {
                const ID_Ejercicio = req.params.ID_Ejercicio;
                if (!ObjectID.isValid(ID_Ejercicio)) {
                    res.status(400).json({ 'error': 'ID de ejercicio no válido' });
                    return;
                }

                await db.collection('ejercicio').deleteOne({ _id: new ObjectID(ID_Ejercicio) });
                res.json({ 'message': 'Ejercicio eliminado correctamente' });
            } catch (error) {
                console.error('Error al eliminar un ejercicio:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });


        // Ruta para agregar una estrategia
        app.post('/api/estrategia', async (req, res) => {
            try {
                const nuevaEstrategia = req.body;
                if (!nuevaEstrategia || Object.keys(nuevaEstrategia).length === 0) {
                    res.status(400).json({ error: 'Datos de la estrategia no proporcionados' });
                    return;
                }

                const resultado = await db.collection('estrategia').insertOne(nuevaEstrategia);
                if (resultado.insertedCount === 1) {
                    res.status(201).json({ 'message': 'Estrategia agregada correctamente' });
                } else {
                    res.status(500).json({ 'error': 'Error al agregar la estrategia' });
                }
            } catch (error) {
                console.error('Error al agregar una estrategia:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });


        // Ruta para obtener todas las estrategias
        app.get('/api/estrategia', async (req, res) => {
            try {
                const estrategias = await db.collection('estrategia').find().toArray();
                res.json({ 'elementos': estrategias });
            } catch (error) {
                console.error('Error al obtener todas las estrategias:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });


        // Ruta para eliminar una estrategia
        app.delete('/api/estrategia/:ID_Estrategia', async (req, res) => {
            try {
                const ID_Estrategia = req.params.ID_Estrategia;
                if (!ObjectID.isValid(ID_Estrategia)) {
                    res.status(400).json({ 'error': 'ID de estrategia no válido' });
                    return;
                }

                await db.collection('estrategia').deleteOne({ _id: new ObjectID(ID_Estrategia) });
                res.json({ 'message': 'Estrategia eliminada correctamente' });
            } catch (error) {
                console.error('Error al eliminar una estrategia:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });

        // Ruta para agregar un estilo diferente
        app.post('/api/userdifest', async (req, res) => {
            try {
                const nuevoDifEstilo = req.body;
                if (!nuevoDifEstilo || Object.keys(nuevoDifEstilo).length === 0) {
                    res.status(400).json({ error: 'Datos del estilo diferente no proporcionados' });
                    return;
                }

                const resultado = await db.collection('userdifest').insertOne(nuevoDifEstilo);
                if (resultado.insertedCount === 1) {
                    res.status(201).json({ 'message': 'Estilo diferente agregado correctamente' });
                } else {
                    res.status(500).json({ 'error': 'Error al agregar el estilo diferente' });
                }
            } catch (error) {
                console.error('Error al agregar un estilo diferente:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });


        // Ruta para eliminar un estilo diferente
        app.delete('/api/userdifest/:ID_difest', async (req, res) => {
            try {
                const ID_difest = req.params.ID_difest;

                // Validar que el ID del estilo diferente sea válido antes de intentar eliminarlo
                if (!ObjectID.isValid(ID_difest)) {
                    res.status(400).json({ 'error': 'ID de estilo diferente no válido' });
                    return;
                }

                await db.collection('userdifest').deleteOne({ _id: new ObjectID(ID_difest) });
                res.json({ 'message': 'Estilo diferente eliminado correctamente' });
            } catch (error) {
                console.error('Error al eliminar un estilo diferente:', error);
                res.status(500).json({ 'error': 'Error interno del servidor' });
            }
        });


        // Inicia el servidor
        app.listen(port, () => {
            console.log(`Servidor escuchando en el puerto ${port}`);
        });

        // Cierre de la conexión de MongoDB al cerrar la aplicación
        process.on('SIGINT', () => {
            client.close();
            process.exit();
        });
    } catch (err) {
        console.error('Error de conexión a MongoDB:', err);
    }
};

connectToMongoDB();
