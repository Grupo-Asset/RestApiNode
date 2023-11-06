import { Router } from 'express';
import axios from 'axios';
const router = Router();

router.get('/v1/getallServicio', async (req, res) => {
  try {
    // Configurar las opciones para la solicitud
    const options = {
      method: 'GET',
      url: 'https://api.holded.com/api/invoicing/v1/services',
      headers: { accept: 'application/json' }
    };

    const response = await axios.request(options);

    if (response.status === 200) {
      const data = response.data;

      const listaServicios = [];

      for (const servicio of data) {
        listaServicios.push(servicio);
      }

      res.status(201).send(listaServicios);
    } else {
      console.error(`Error: ${response.status}`);
      res.status(response.status).send({ error: 'Error al obtener datos de servicios' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

export default router;
