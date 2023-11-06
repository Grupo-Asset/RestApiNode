import { Router } from 'express';
import axios from 'axios'; // Importamos axios
const router = Router();

router.post('/v1/register', async (req, res) => {
    const { nombre, email, mobile, password } = req.body;

    if (nombre && email && mobile && password) {
        try {
            // Configurar las opciones para la solicitud
            const options = {
                method: 'POST',
                url: 'https://api.holded.com/api/invoicing/v1/contacts',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
                data: {
                    name: nombre,
                    email: email,
                    mobile: mobile,
                    socialNetworks: {
                        website: password,
                    },
                },
            };

            const response = await axios.request(options);

            if (response.status === 201) {
                res.status(201).send('Contacto creado con éxito👌👍');
            } else {
                console.error(`Error: ${response.status}`);
                res.status(response.status).send({ error: 'Error al crear el contacto' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send({ error: err.message });
        }
    } else {
        res.status(400).send({ error: 'Faltan datos requeridos' });
    }
});

export default router;
