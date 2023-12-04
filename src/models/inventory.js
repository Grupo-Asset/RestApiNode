import axios from 'axios'

export default class InventoryModel {

  static async getAllProducts() {
    try {
        const options = {
            method: 'GET',
            url: 'https://api.holded.com/api/invoicing/v1/products',
            headers: {
                accept: 'application/json',
                key: 'c1e86f21bcc5fdedc6c36bd30cb5b596'
            }
        };

        const response = await axios.request(options);

        if (response.status === 200) {
            const data = response.data;
            console.log(data)
            const listaProductos = [];

            for (const producto of data) {
                listaProductos.push(producto);
            }

            return listaProductos;
        } else {
            console.error(`Error: ${response.status}`);
            return { error: true, status: response.status };
        }
    } catch (err) {
        if (axios.isAxiosError(err)) {
            console.error('Error de red:', err.code);
            return { error: true, info: err.message };
        } else {
            console.error('Otro tipo de error:', err);
            return { error: true, info: err.stack };
        }
    }
}


    static async getAllServices(){
        try {
            // Configurar las opciones para la solicitud
            const options = {
              method: 'GET',
              url: 'https://api.holded.com/api/invoicing/v1/services',
              headers: { accept: 'application/json',
              key: 'c1e86f21bcc5fdedc6c36bd30cb5b596' }
            };
        
            const response = await axios.request(options);
        
            if (response.status === 200) {
              const data = response.data;
        
              const listaServicios = [];
        
              for (const servicio of data) {
                listaServicios.push(servicio);
              }
        
              return listaServicios
            } else {
              console.error(`Error: ${response.status}`);
              return {error:true}
            }
          } catch (err) {
            console.error(err);
            return {error:true}
          }
    }
}