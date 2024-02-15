import puppeteer from "puppeteer";
import csv from "csv-parser";
import fs from "fs";
const dealsData = [];


  fs.createReadStream('minpax.csv')
  .pipe(csv())
  .on('data', (row) => {
    dealsData.push(row);
  }
  )
  .on('end', () => {
    console.log('CSV file successfully processed');
    //console.log(dealsData);
    //getQuotes();
  });



  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();
  const cookie = {
    name: 'sentinel_token',
    value: '', //sentinel token without last semicolon
    domain: 'dineout-girf-deals-dashboard.swiggyops.de',
    url: 'https://dineout-girf-deals-dashboard.swiggyops.de',
    path: '/',
    httpOnly: true,
    secure: true
}

  await page.setCookie(cookie);

  for (let i = 0; i < dealsData.length; i++) {
    const deal = dealsData[i];
   // console.log(deal);
    await page.goto("https://dineout-girf-deals-dashboard.swiggyops.de/admin/TicketCreation/deal_edit?r_id="+deal.R_ID+"&tl_id="+deal.TL_ID, {
      waitUntil: "domcontentloaded",
    });
  }


await page.evaluate(() => {
  document.querySelector("#min_quantity").value=1;
});
      
    await page.click('#save_btn');

    await page.waitForNavigation();

  // // Close the browser
   await browser.close();
