# Construcion de la API para desplegar en FirBase

Crear una carpeta donde se almacenara el proyecto.

**comandos para iniciar**

Instala Firebase CLI:
- Instala la CLI de Firebase ejecutando el siguiente comando en tu terminal:
``` bash
npm install -g firebase-tools
```
-Crea un nuevo proyecto de Firebase:
Ve al Firebase Console y crea un nuevo proyecto.

-Configura tu proyecto:
Desde la terminal, ejecuta el siguiente comando para iniciar la configuración de Firebase en tu proyecto:

``` bash
firebase init
```

**Configuración del servidor Express con MongoDB**

Instala las dependencias:
- En tu proyecto, instala las dependencias necesarias, incluyendo express y mongodb:
``` bash
npm install express mongodb
```

**Configura tu servidor Express y establece la conexión con MongoDB. Aquí hay un ejemplo básico:**

``` js
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = process.env.PORT || 3000;

const uri = 'tu_uri_de_conexion';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.error('Error de conexión a MongoDB:', err);
    return;
  }
  console.log('Conexión exitosa a MongoDB');

//Aqui va la logica de la API

  app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
});
```

**Despliegue en Firebase**

Construye tu aplicación:
 - Desde la terminal, ejecuta el siguiente comando para construir tu aplicación:

``` bash
 firebase deploy --only hosting
```

**Despliega tu API:**

Asegúrate de que tu servidor Express esté en ejecución localmente.
Puedes usar Firebase Functions para desplegar tu API, o puedes utilizar Cloud Functions y Firebase Hosting para alojar tu API junto con tu aplicación web