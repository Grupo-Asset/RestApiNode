import { Router } from 'express';
// const sdk = require('api')('@holded/v1.0#3cm531nlbw08qsz');
import numeral from 'numeral';

const router = Router();

router.post('/v1/venta', async (req, res) => {
  console.log(req.body);

  if (!req.body) {
    return res.status(400).send({ error: 'Faltan datos requeridos' });
  }

  const fechaActual = new Date();
  const fechaUnix = Math.floor(fechaActual.getTime() / 1000);

  try {
    sdk.auth('c1e86f21bcc5fdedc6c36bd30cb5b596');

    const lockerServiceId = getLockerServiceId(req.body.storage);
    if (!lockerServiceId) {
      return res.status(400).send({ error: 'Tipo de almacenamiento no válido' });
    }

    const facturaData = {
      items: [
        { sku: req.body.sku },
        { serviceId: lockerServiceId, units: 1, subtotal: 0 },
        { serviceId: "645D044E23E518E60F0135A3", units: req.body.sum, subtotal: 0 },
        { serviceId: "64662B54CA7D9D6A830593AE", units: req.body.guarderia, subtotal: 0 },
        { serviceId: "646629D3E5CA046AA701BA42", units: req.body.cw, subtotal: 0 },
      ],
      customFields: [
        { "Financiacion": "70/30" },
        {
          "pago N": "1/12",
          "Fecha": new Date().toLocaleDateString(),
          "Valor dolar": numeral(req.body.dolarValue).format('0,0.00'),
          "Pago en pesos": `ARS$${numeral(req.body.amount * 1.21).format('0.0,0')}`,
        },
      ],
      applyContactDefaults: true,
      contactId: req.body.user.id,
      date: fechaUnix,
      dueDate: 2 * fechaUnix,
    };

    // Crear la factura en Holded
    const facturaResponse = await sdk.createDocument(facturaData, { docType: 'invoice' });

    // Verificar el método de pago (ejemplo: 'efectivo', 'tarjeta', etc.)
    const metodoDePago = req.body.paymentMethod;
    if (metodoDePago === 'efectivo') {
      // Aquí podrías agregar lógica para manejar el pago en efectivo
      // Por ejemplo, registrar que el pago se realizó en efectivo
    } else {
      // Si no se especifica el método de pago o es desconocido, muestra un error
      return res.status(400).send({ error: 'Método de pago no válido' });
    }

    // Registrar el pago de la factura en Holded
    const pagoData = {
      date: fechaUnix,
      amount: (req.body.amount * 1.21) / req.body.dolarValue,
    };
    await sdk.payDocument(pagoData, { docType: 'invoice', documentId: facturaResponse.data.id });

    // Crear una orden de compra en Holded para reflejar la operación de compra
    await createPurchaseOrder(req.body, fechaUnix, facturaResponse.data.id);

    return res.status(201).json({ titulo: 'Factura creada y pagada con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Error al procesar la factura' });
  }
});

function getLockerServiceId(storageType) {
  const storageServiceIds = {
    'Almacenamiento L': "64662AB670EB6571F10A6942",
    'Almacenamiento M': "64662A98C275900011057387",
    'Almacenamiento S': "64662A7C6B56EB8ADC009299",
  };
  return storageServiceIds[storageType];
}

async function createPurchaseOrder(data, fechaUnix, facturaId) {
  // Lógica para crear la orden de compra en Holded
  // Aquí puedes usar 'sdk.createDocument' con docType 'purchaseorder'
  // y otros datos relacionados con la orden de compra.
}

export default router;
