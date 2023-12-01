import axios from 'axios'

export class InventoryModel {

    static async getAllProducts(){
        try {
            // Configurar las opciones para la solicitud
            const options = {
                method: 'GET',
                url: 'https://api.holded.com/api/invoicing/v1/products',
                headers: { accept: 'application/json' }
            };
        
            const response = await axios.request(options);
        
            if (response.status === 200) {
                const data = response.data;
        
                const listaProductos = [];
        
                for (const producto of data) {
                listaProductos.push(producto);
                }
        
                return listaProductos
            } else {
                console.error(`Error: ${response.status}`);
                return {error:true}
            }
            } catch (err) {
            console.error(err);
            return{ error: true, info: err}
            } 
    }

    static async getAllServices(){
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