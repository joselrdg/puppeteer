const pageScraper = require('./pageScraper');
const pagePdfScraper = require('./pagePdfScraper');


let data = { url: [], group: [] }
let funciones = []
let scrapeAll = (browserInstance) => new Promise(async(resolve, reject) => {
// async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance;
        const id = await pageScraper.scraper(browser);
        console.log(id)
        data.url.push(id)
        for (let index = 0; index < id.length; index++) {
            const element = id[index];
            funciones.push(
                {
                    url: element,
                    async scraper(browser) {
                        let page = await browser.newPage();
                        console.log(`Navigating to ${this.url}...`);
                        await page.goto(this.url);

                        await page.waitForSelector('.race');
                        let urls = await page.evaluate(() => {
                            let results = [];
                            let items = document.querySelectorAll('.standard > a');
                            items.forEach((item) => {
                                let url = item.getAttribute('href')
                                url = url.replace('../../','')
                                results.push(url);
                            });
                            return results;
                        })
                        return urls;
                    }
                }
            )
        }

        for (urls in funciones) {
            browser = await browserInstance;
            const id = await funciones[urls].scraper(browser);
            data.group.push(id)
        }

        resolve(data);
            // await newPage.close();
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
})



module.exports = (browserInstance) => scrapeAll(browserInstance)