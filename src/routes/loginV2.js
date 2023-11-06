 import { Router } from 'express';
import axios from 'axios'; // Importamos axios
const router = Router();

router.get('/v2/login', async (req, res) => {
  const { email, password } = req.query;

  try {
    // Configurar las opciones para la solicitud
    const options = {
      method: 'GET',
      url: 'https://api.holded.com/api/invoicing/v1/contacts',
      headers: { accept: 'application/json', key: 'c1e86f21bcc5fdedc6c36bd30cb5b596' }
    };

    const response = await axios.request(options);

    if (response.status === 200) {
      const data = response.data;

      // Buscar el contacto que coincide con el correo electrónico y la contraseña proporcionados
      const user = data.find(
        (contact) => contact.email === email && String(contact.socialNetworks?.website) === String(password)
      );

      if (!user) {
        res.status(401).send({ error: 'Credenciales inválidas' });
        return;
      } else {
        
        const [facturasResponse, ordenesCompraResponse] = await Promise.all([
          axios.get('https://api.holded.com/api/invoicing/v1/documents?docType=invoice'),
          axios.get('https://api.holded.com/api/invoicing/v1/documents?docType=purchaseorder')
        ]);
        
        const listaFacturas = facturasResponse.data;
        const listaOrdenesCompras = ordenesCompraResponse.data;
        const listaProductos = []; 
        let productsOwn = [];
        let servicesOwn = [];
        let facturas = [];
        let ordenesCompras = [];
        
        for (const factura of JSON.parse(data)) {
          listaProductos.push(factura); // Agregar cada producto a la lista
  
          if (factura.contact === user.id) {
            facturas.push(factura);
            factura.products.forEach((product) => {
              if (product.serviceId) {
                servicesOwn.push(product);
              } else {
                productsOwn.push(product.name);
              }
            })

        const userDTO = {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          id: user.id,
          // Otras propiedades que quieras agregar aquí
        };

        res.status(201).send(userDTO);
      }
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
