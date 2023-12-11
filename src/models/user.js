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

    // constructor(){
    //     if(UserModel.instance){
    //         return UserModel.instance;
    //     }
    //     UserModel.instance = this;
    //     this.userList = userList;

    // }

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
        return 'Usuario no encontrado';
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


    static async update(id, cambios) {
        try {
            // console.log(userList[0])
            const user = userList.find((contact) => contact.id === id);
            // console.log(user)
            if (!user) {
                return { status: 404, message: 'Usuario no encontrado' };
            }
    
            const usuario = {
                ...user,
                ...cambios
            };
    
            console.log(usuario);
    
            const options = {
                method: 'PUT',
                url: `https://api.holded.com/api/invoicing/v1/contacts/${usuario.id}`,
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    key: 'c1e86f21bcc5fdedc6c36bd30cb5b596'
                },
                data: usuario,
            };
    
            const response = await axios(options);
    
            console.log(response.data);
    
            if (response.status === 200) {
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
