const browserObject = require('./browser');
const scraperController = require('./pageController');
const pagePdfScraper = require('./pagePdfScraper');


//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

// Pass the browser instance to the scraper controller
const url = "https://cuentosinfantiles.top/wp-content/uploads/cuentos_digital/Peter%20Pan.pdf"
pagePdfScraper(browserInstance, url)
// scraperController(browserInstance)
// .then((d)=>{pagePdfScraper(d)})
// .catch((e)=>{console.error(e)})



