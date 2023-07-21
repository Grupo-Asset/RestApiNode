const { Router } = require('express');
const axios = require('axios');
const router= Router();

router.get('/v2/getDolar', async (req,res) => {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://www.dolarsi.com/api/api.php?type=valoresprincipales',

    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data[4]));
      res.status(201).json({
        type: "Dolar DolarSi",
        price: response.data[4].casa.compra,
        date: Math.floor(new Date().getTime() / 1000)
    })
    })
    .catch((error) => {
      console.log(error);
    });

});

module.exports = router;
