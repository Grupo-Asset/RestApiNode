import { Router } from 'express';
import axios from 'axios'; // Importamos axios
const router = Router();

router.get('/', async (req, res) => {
  try {
    const options = {
      method: 'GET',
      url: 'https://api.holded.com/api/invoicing/v1/contacts',
      headers: { accept: 'application/json', key: 'c1e86f21bcc5fdedc6c36bd30cb5b596' }
    };

    const response = await axios.request(options);

    if (response.status === 200) {
      console.log(response.data);
      res.send(response.data);
    } else {
      console.error(`Error: ${response.status}`);
      res.status(response.status).send({ error: 'Error al obtener datos' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

export default router;
