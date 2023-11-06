import { Router } from 'express';
import axios from 'axios';
import puppeteer from 'puppeteer';

const router = Router();

router.get('/v3/getDolar', async (req, res) => {
    try {
      const url = 'https://www.ambito.com/contenidos/dolar-mep.html';
  
      const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
      const page = await browser.newPage();
  
      // Adjust the viewport to improve page loading (optional)
      await page.setViewport({ width: 1280, height: 800 });
  
      // Navigate to the page and wait until the 'load' event
      await page.goto(url, { waitUntil: 'load' });
  
      // Extract the dollar value from the page
      const dollarVentaValue = await page.evaluate(() => {
        const valueElement = document.querySelector('.data-valor');
        return valueElement.innerText;
      });

      // Close the browser
      await browser.close();
  
      // Clean up the extracted value (remove any whitespace characters)
      const cleanedDollarVentaValue = dollarVentaValue.trim();
  
      // Convert the dollar value to a number
      const parsedDollarVentaValue = parseFloat(cleanedDollarVentaValue.replace('$', '').replace(',', '.'));
  
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

export default router;
