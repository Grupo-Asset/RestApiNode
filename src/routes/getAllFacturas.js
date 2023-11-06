import { Router } from 'express';
import axios from 'axios';
// import { userDTO } from './loginV2.js'

const router = Router();

router.get('/v1/getallFacturas', async (req, res) => {
  try {
    // Configura las opciones para la solicitud
    const options = {
      method: 'GET',
      url: 'https://api.holded.com/api/invoicing/v1/invoices',
      headers: { accept: 'application/json' },
      auth: {
        username: 'c1e86f21bcc5fdedc6c36bd30cb5b596',
        password: '', // Debes proporcionar la contraseña si es necesaria
      },
    };

    const response = await axios.request(options);

    if (response.status === 200) {
      const data = response.data;

      const listaFacturas = [];

      for (const factura of data) {
        listaFacturas.push(factura);
      }

      const result = {
        product: listaFacturas[0].products[0].name,
        total: listaFacturas[0].total,
      };

      res.status(201).send(result);
    } else {
      console.error(`Error: ${response.status}`);
      res.status(response.status).send({ error: 'Error al obtener datos de facturas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

export default router;
