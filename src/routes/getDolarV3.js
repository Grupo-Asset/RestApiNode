const { Router } = require('express');
const axios = require('axios');
const router= Router();

const puppeteer = require('puppeteer');



router.get('/v3/getDolar', async (req, res) => {
    try {
      const url = 'https://www.ambito.com/contenidos/dolar-mep.html';
  
      const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      const page = await browser.newPage();
  
      // Adjust the viewport to improve page loading (optional)
      await page.setViewport({ width: 1280, height: 800 });
  
      // Navigate to the page and wait until the 'load' event
      await page.goto(url, { waitUntil: 'load' });

      
  
      // Wait for the element containing the dollar value to appear on the page
      // await page.waitForSelector('.venta .value');
  
      // Extract the dollar value (Venta) from the element
      const dollarVentaValue = await page.evaluate(()=>{
        const valueElements = document.querySelector('.data-valor');
        return valueElements.innerText
        // return Array.from(valueElements).map((element) => element.innerText);

        
      })
  console.log(await dollarVentaValue)
      // Close the browser
      await browser.close();
  
      // // Clean up the extracted value (remove any whitespace characters)
      const cleanedDollarVentaValue = dollarVentaValue.trim();
  
      // // Convert the dollar value to a number (you might want to perform further processing here if needed)
      const parsedDollarVentaValue = parseFloat(cleanedDollarVentaValue.replace('$', '').replace(',', '.'));
      console.log(parsedDollarVentaValue)
      res.status(200).json({
        type: 'Dolar MEP Venta',
        price: parsedDollarVentaValue,
        date: Math.floor(new Date().getTime() / 1000),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while fetching the dollar value.' });
    }
  });

  
module.exports =  router;
