import { UserModel } from "../models/user.js";

export class UserController {
    static async getAll (req, res) {
      const usuarios = await UsuerModel.getAll();
      res.json(usuarios)
    
    }
    static async login (req, res) {
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
        // Realizar una solicitud para obtener documentos (facturas y órdenes de compra)
        const [facturasResponse, ordenesCompraResponse] = await Promise.all([
          axios.get('https://api.holded.com/api/invoicing/v1/documents?docType=invoice'),
          axios.get('https://api.holded.com/api/invoicing/v1/documents?docType=purchaseorder')
        ]);

        const facturas = facturasResponse.data;
        const ordenesCompras = ordenesCompraResponse.data;

        // Procesar los documentos y construir la respuesta
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
    }
}