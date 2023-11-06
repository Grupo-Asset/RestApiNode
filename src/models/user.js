import axios from 'axios';
import { z } from 'zod';

let userList = [];

// Definir el esquema Zod
const UserDTO = z.object({
    nombre: z.string(),
    email: z.string().email(),
    mobile: z.string(),
    password: z.string(),
});

async function init() {
try {
    const options = {
        method: 'GET',
        url: 'https://api.holded.com/api/invoicing/v1/contacts',
        headers: { accept: 'application/json', key: 'c1e86f21bcc5fdedc6c36bd30cb5b596' }
    };

    const response = await axios.request(options);

    if (response.status === 200) {
        console.log(response.data);
        userList = response.data;
    } else {
        console.error(`Error: ${response.status}`);
    }
} catch (err) {
    console.error(err);
    }
}

export class UserModel {
    static async init() {
    await init();
    }

    static async getAll(){
    return userList;
    }

    static async getUser(email, password){
    const user = userList.find(
        (contact) => 
        contact.email === email && 
        String(contact.socialNetworks?.website) === String(password)
    );

    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const userDTO = {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        id: user.id,
        password: String(user.socialNetworks?.website),
        fechaNac: user.iban,
        genero: user.swift,
        lang: user.defaults.language,
        address: user.billAddress
    };

    return userDTO;
    }

    static async register(userDTO){
    // Validar los datos de entrada con Zod
    const validatedData = UserDTO.parse(userDTO);

    const { nombre, email, mobile, password } = validatedData; 

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
        return { status: 201, message: 'Contacto creado con éxito👌👍' };
        } else {
        throw new Error('Error al crear el contacto');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
    }
    static async update(userDTO){
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
    }
}
