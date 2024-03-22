// import puppeteer from 'puppeteer';
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
        // try {
        //     const url = 'https://www.ambito.com/contenidos/dolar-mep.html';
        
        //     const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        //     const page = await browser.newPage();
        
        //     // Adjust the viewport to improve page loading (optional)
        //     await page.setViewport({ width: 1280, height: 800 });
        
        //     // Navigate to the page and wait until the 'load' event
        //     await page.goto(url, { waitUntil: 'load' });
        
        //     // Extract the dollar value from the page
        //     const dollarVentaValue = await page.evaluate(() => {
        //       const valueElement = document.querySelector('.data-valor');
        //       return valueElement.innerText;
        //     });
      
        //     // Close the browser
        //     await browser.close();
        
        //     // Clean up the extracted value (remove any whitespace characters)
        //     const cleanedDollarVentaValue = dollarVentaValue.trim();
        
        //     // Convert the dollar value to a number
        //     const parsedDollarVentaValue = parseFloat(cleanedDollarVentaValue.replace('$', '').replace(',', '.'));
        
        //     return {
        //       type: 'Dolar MEP Venta',
        //       price: parsedDollarVentaValue,
        //       date: Math.floor(new Date().getTime() / 1000),
        //     };
        //   } catch (error) {
        //     console.log(error);
        //     res.status(500).json({ error: 'An error occurred while fetching the dollar value.' });
        //   }

        try{
          let config = {
            method: 'get',
            url: 'https://mercados.ambito.com//dolarrava/mep/variacion',
          };
          axios.request(config)
          .then((response) => {
            console.log(response);
            return {
              type: "Dolar Ambito",
              price: response.data.ultimo,
              date: Math.floor(new Date().getTime() / 1000)
            }
          }

          )
        }catch(e){
          console.log(e)
        }
    }
}

export { Bcra, DolarHoy, Ambito };