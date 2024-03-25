import axios from 'axios';


let userList = [];


async function init() {
try {
    const options = {
        method: 'GET',
        url: 'https://api.holded.com/api/invoicing/v1/contacts',
        headers: { accept: 'application/json', key: 'c1e86f21bcc5fdedc6c36bd30cb5b596' }
    };

    const response = await axios.request(options);

    if (response.status === 200) {
        console.log("init funcino");
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
        console.log("init funcino");

    await init();
    }

    static async getAll(){
        console.log("llego al modelo")
    return userList;
    }

    static async getById(id){
        return userList.find((contact) => contact.id === id)
    }

    static async hijoDeRemilPuta(email, password){
        console.log("antes del find.", userList)
        console.log({email,password})
    const user = userList.find(
        (contact) => 
        contact.email === email && 
        contact.socialNetworks.website  === password
    );
   

    if (!user) {
        throw new Error( 'Usuario no encontrado');
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
    

    const { nombre, email, mobile, password } = userDTO; 

    try {
      // Configurar las opciones para la solicitud
        const options = {
        method: 'POST',
        url: 'https://api.holded.com/api/invoicing/v1/contacts',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            key: 'c1e86f21bcc5fdedc6c36bd30cb5b596'
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
    static async getUser(id){
        const user = userList.find((contact) => contact.id === id);
        return user
    }


    static async update(id, usuario) {
        try {
     
            console.log('usuario con cambios:',usuario);
            // // console.log('user populado',JSON.stringify(usuario));


            const usuarioActualizado=  {
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
            }
            const options = {
                method: 'PUT',
                url: `https://api.holded.com/api/invoicing/v1/contacts/${id}`,
                headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        key: 'c1e86f21bcc5fdedc6c36bd30cb5b596'
                    },
                data:usuarioActualizado,
            };
            console.log("data a holded:",options.data)
    
            const response = await axios(options);
    
            console.log(response.data);
    
            if (response.status === 200 || response.status === 1) {
                const indice = userList.findIndex(usr => ( usr.id === id));
                if (indice !== -1) userList[indice] = {...userList[indice], ...usuarioActualizado}
                // userList = userList.map(usr =>(usr.id === id ? usuarioActualizado : usr))
                
                // console.log("user list actualizada", userList[0])
                return { status: 201, message: 'Contacto actualizado con éxito👌👍' };
            } else {
                throw new Error('Error al actualizar el contacto');
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    
    

    
}
