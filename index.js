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
    value: 'eyJhbGciOiJSUzI1NiIsImtpZCI6InNlbnRpbmVsL3h1OEM5MERLbUtsS3Y5VmZUU1JRM2pkS2RITFNMSlpveVRYckNFNWc0b3M9In0.eyJhdWQiOlsic2VudGluZWwiLCJESU5FT1VULURFQUwtQ1JNIl0sImV4cCI6MTcwODE5NDA1OSwiaXNzIjoic2VudGluZWwiLCJuYW1lIjoiUHJhc2hhbnQgS3VtYXIiLCJuYmYiOjE3MDgxMDc2NTksIm9pZCI6ImI1MDRiYTRmLTQ3ZmQtNDQwYy05YjY2LTdkYTU1NTA3YjhjZCIsInJvbGVzIjpbIkFETUlOIl0sInN1YiI6InByYXNoYW50Lmt1bWFyNkBzd2lnZ3kuaW4ifQ.RFx32wiY1lQf8tftuDhNn1scefDapOVx6fc0hgZSPQzeG4b6mEWl3xe_Bel3WzyJEzPIQTGXlYiQIGRn3Gz0k5MZEX3NQ4FLHE6BvbGXMSH4UG2Dh8w25skGScBPwAf8tndvUjd6sOE7ysXiJdpTnqYnC_nt7zJ9f5NTGkf4paXJ3LTyHhbqvbC7iClGwO652v4vPtz6zjSJ7by_gDgENaQhCN6gE1wp7teoTnr9KZ7cX3RH6Zs5h9F-wrtDy_MVTAUZ94kjM8Wj_w7eJbELveBzhWTVRmB91tCsVgVWbk8tvuZIHehEqd8OO-NNzXaTtRKbN4RwI-AParOmirZYVg', //sentinel token without last semicolon
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
  


// await page.evaluate(  () => {
//   console.log("inside evaluate");
//   document.querySelector("#min_quantity").value=1;
// });
    await page.waitForSelector('input[name=min_quantity]');
    await page.$eval('#min_quantity', el => el.value = '1');
    await page.click('#save_btn');
    console.log("clicked save");
    await page.waitForNavigation();
  }

  // // Close the browser
   await browser.close();
