const browserObject = require('./browser');
const scraperController = require('./pageController');
const pagePdfScraper = require('./pagePdfScraper');


//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

// Pass the browser instance to the scraper controller
const urlS = ["http://www.fci.be/Nomenclature/Standards/166g01-es.pdf",'http://www.fci.be/Nomenclature/Standards/293g01-es.pdf','http://www.fci.be/Nomenclature/Standards/015g01-es.pdf']

// urlS.forEach(element => {
    
 pagePdfScraper(browserInstance, "http://www.fci.be/Nomenclature/Standards/166g01-es.pdf")
 .then((r)=>{console.log(r)})
//  .then('pdf guardado correctamente')
 .catch((e)=> console.error(e))    
// }); 


// pagePdfScraper(browserInstance, urlS)
// scraperController(browserInstance)
//     .then((d) => { pagePdfScraper(d) })
//     .catch((e) => { console.error(e) })



