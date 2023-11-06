import axios from 'axios'; // Importamos axios
let userList=[];
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

export class UserModel {
    static async getAll(){
        return userList;
    }

    static async getUser(){
        const user = userList.find(
            (contact) => 
            contact.email === email && 
            String(contact.socialNetworks?.website) === String(password)
        );
    }
}

// class User {
//   #name;
//   #email;
//   #mobile;
//   #id;
//   #productos;
  
//   constructor({ name = "", email = "", mobile = "", id = "", productos = [] }) {
//     this.#name = name;
//     this.#email = email;
//     this.#mobile = mobile;
//     this.#id = id;
//     this.#productos = productos;
//   }
  

//   // Métodos de acceso para los atributos privados
//   getName() {
//     return this.#name;
//   }

//   getEmail() {
//     return this.#email;
//   }

//   getMobile() {
//     return this.#mobile;
//   }

//   getId() {
//     return this.#id;
//   }

//   getProductos() {
//     return this.#productos;
//   }

//   // Métodos de modificación para los atributos privados
//   setName(name) {
//     this.#name = name;
//   }

//   setEmail(email) {
//     this.#email = email;
//   }

//   setMobile(mobile) {
//     this.#mobile = mobile;
//   }

//   setId(id) {
//     this.#id = id;
//   }

//   setProductos(productos) {
//     this.#productos = productos;
//   }
// }

// module.exports = User;
