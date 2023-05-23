const { Router } = require('express');
const router= Router();
const sdk = require('api')('@holded/v1.0#3cm531nlbw08qsz');


router.get('/v1/getallServicio', async (req, res) => {

    sdk.auth('343654e3d1014f792344a19ee8f40503');
    try {

      const { data } = await sdk.listServices();

      const listaServicios = []; // Crear una lista vacía

      for (const servicio of data) {
        listaServicios.push(servicio); // Agregar cada producto a la lista
      }

      res.status(201).send(listaServicios); // Devolver la lista de productos
      console.log(listaServicios);


    } catch (err) {
      console.error(err);
      res.status(500).send({ error: err.message }); 
    }
  
});



module.exports = router;