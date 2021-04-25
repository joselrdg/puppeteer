const browserObject = require('./browser');
const scraperController = require('./pageController');
const pagePdfScraper = require('./pagePdfScraper');
const pdfAObjt = require('./pdfparse/index')


//Start the browser and create a browser instance
let browserInstance = browserObject.startBrowser();

// Pass the browser instance to the scraper controller
const urlS = [["http://www.fci.be/Nomenclature/Standards/166g01-es.pdf", 'http://www.fci.be/Nomenclature/Standards/293g01-es.pdf', 'http://www.fci.be/Nomenclature/Standards/015g01-es.pdf']]



// pagePdfScraper(browserInstance, urlS)
//     .then((r) => {
//         pdfAObjt(r)
//             .then((data) => { console.log(data)})
//     })
//     .catch((e) => console.error(e))


scraperController(browserInstance)
    .then((d) => {
        pagePdfScraper(browserInstance, d.group)
            .then((r) => {
                pdfAObjt(r)
                    .then((data) => { console.log(data); console.log('yeaaaaaaaaasiiiiiiiiiiiiiiiiii') })
            })
            .catch((e) => console.error(e))
    })
    .catch((e) => { console.error(e) })



