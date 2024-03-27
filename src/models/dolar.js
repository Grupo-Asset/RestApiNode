
import axios from 'axios'
class Bcra {
    static getDolar() {
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
            return {
              type: "Dolar BCBA",
              price: response.data.at(-1).v,
              date: Math.floor(new Date().getTime() / 1000)
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }
}

class DolarHoy {
    static getDolarHoy() {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://www.dolarsi.com/api/api.php?type=valoresprincipales',
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data[4]));
            return {
              type: "Dolar DolarSi",
              price: response.data[4].casa.compra,
              date: Math.floor(new Date().getTime() / 1000)
            }
          })
          .catch((error) => {
            console.log(error);
          });
    }
}

class Ambito {
  static async getDolar() {
      try{
          let config = {
              method: 'get',
              url: 'https://mercados.ambito.com//dolarrava/mep/variacion',
          };
          return axios.request(config)
          .then((response) => {
              console.log(response.data);
              const dolar ={
                  type: "Dolar Ambito",
                  price: response.data.ultimo,
                  date: Math.floor(new Date().getTime() / 1000)
              }
              console.log(dolar)
              return dolar
          })
      }catch(e){
          console.log(e)
      }
  }
}


export { Bcra, DolarHoy, Ambito };