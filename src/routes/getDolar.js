import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/v1/getDolar', async (req, res) => {

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://api.estadisticasbcra.com/usd',
      headers: { 
        'Authorization': 'BEARER eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTg5ODM2NjAsInR5cGUiOiJleHRlcm5hbCIsInVzZXIiOiJpdEBncnVwby1hc3NldC5jb20ifQ.v8Assa-OYs24dA6HbmRHi-ovpCfxpzwNFjPaj08TboM7gT3PZcFPuWV10ktrHNlPx-nsc4oh4AP5QIORP0ipGg'
      }
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data.at(-1)));
      res.status(201).json({
        type: "Dolar BCBA",
        price: response.data.at(-1).v,
        date: Math.floor(new Date().getTime() / 1000)
      })
    })
    .catch((error) => {
      console.log(error);
    });

});

export default router;
