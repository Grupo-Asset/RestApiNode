import { Router } from 'express';
import axios from 'axios'; 
const router = Router();


function findUser(data, email, password) {
  return data.find(
    (contact) => contact.email === email && String(contact.socialNetworks?.website) === String(password)
  );
}


function processFacturas(listaFacturas, userId) {
  let productsOwn = [];
  let servicesOwn = [];
  let facturasDeUser = [];

  listaFacturas.forEach(factura => {
    if (factura.contact === userId) {
      facturasDeUser.push(factura);

      factura.products.forEach(product => {
        if (product.serviceId) {
          servicesOwn.push(product);
        } else {
          productsOwn.push(product.name);
        }
      });
    }
  });

  return { facturasDeUser, productsOwn, servicesOwn };
}

router.get('/v2/login', async (req, res) => {
  const { email, password } = req.query;

  try {
    
    const options = {
      method: 'GET',
      url: 'https://api.holded.com/api/invoicing/v1/contacts',
      headers: { accept: 'application/json', key: 'c1e86f21bcc5fdedc6c36bd30cb5b596' }
    };

    const response = await axios.request(options);

    if (response.status === 200) {
      const data = response.data;

      const user = findUser(data, email, password);

      if (!user) {
        res.status(401).send({ error: 'Credenciales inválidas' });
        return;
      } else {
        const [facturasResponse, ordenesCompraResponse] = await Promise.all([
          axios.get('https://api.holded.com/api/invoicing/v1/documents?docType=invoice'),
          axios.get('https://api.holded.com/api/invoicing/v1/documents?docType=purchaseorder')
        ]);

        const listaFacturas = facturasResponse.data;
        const listaOrdenesCompras = ordenesCompraResponse.data.filter(purchaseOrden => purchaseOrden.contact === user.id);

        const { facturasDeUser, productsOwn, servicesOwn } = processFacturas(listaFacturas, user.id);

        const userDTO = {
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          id: user.id,
          productos: productsOwn,
          password: String(user.socialNetworks?.website),
          servicios: servicesOwn,
          facturas: facturasDeUser,
          ordenesCompra: listaOrdenesCompras,
          fechaNac: user.iban,
          genero: user.swift,
          lang: user.defaults.language,
          address: user.billAddress
          
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
