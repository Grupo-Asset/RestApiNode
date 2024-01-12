import { Router } from 'express';
import axios from 'axios'; // Importamos axios

const router = Router();

router.post('/v1/updateUser', async (req, res) => {
    const usuario = req.body;
    console.log(usuario);

    try {
        // Configurar las opciones para la solicitud
        const options = {
            method: 'PUT',
            url: `https://api.holded.com/api/invoicing/v1/contacts/${usuario.id}`,
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
            },
            data: {
                name: usuario.name,
                socialNetworks: {
                    website: usuario.password,
                },
                mobile: usuario.mobile,
                iban: usuario.fechaNac,
                swift: usuario.genero,
                defaults: {
                    language: usuario.lang,
                },
                billAddress: {
                    address: usuario.address.address_components && usuario.address.address_components[1] ?
                        usuario.address.address_components[1].long_name + ' ' + usuario.address.address_components[0].long_name :
                        usuario.address.address,
                    city: usuario.address.address_components && usuario.address.address_components[3] ?
                        usuario.address.address_components[3].long_name :
                        usuario.address.city,
                    postalCode: usuario.address.address_components && usuario.address.address_components[6] ?
                        usuario.address.address_components[6].long_name :
                        usuario.address.postalCode,
                    province: usuario.address.address_components && usuario.address.address_components[4] ?
                        usuario.address.address_components[4].long_name :
                        usuario.address.province,
                    country: usuario.address.address_components && usuario.address.address_components[5] ?
                        usuario.address.address_components[5].long_name :
                        usuario.address.country,
                },
            },
        };

        const response = await axios.request(options);

        console.log(response.data);

        res.status(201).send(usuario);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
    }
});

export default router;
