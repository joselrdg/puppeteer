const scraperObject = {
    url: 'http://www.fci.be/es/Nomenclature/',
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);

        // Wait for the required DOM to be rendered
        await page.waitForSelector('.grouplist');
        let urls = await page.$$eval('li', links => {
            links = links.filter(link => link.querySelector('.group'))
            links = links.map(el => el.querySelector('.group > a').href)
            return links;
        });
        console.log(urls);


        // Loop through each of those links, open a new page instance and get the relevant data from them
        let pagePromise = (link, num) => new Promise(async (resolve, reject) => {
            console.log(link)
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);

            await page.waitForSelector('contenu nomenclature');
            let urls = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('td');
                // items.forEach((item) => {
                //     results.push({
                //         url:  item.getAttribute('href'),
                //         text: item.innerText,
                //     });
                // });
                return items;
            })


            // dataObj['link'] = link    
            dataObj['grupo'] = urls
            // // Get the link to all the required books
            // dataObj['grupo'] = await page.$$eval('a', links => {
            //     // Make sure the book to be scraped is in stock
            //     // links = links.filter(link => link.querySelector('.standard'))
            //     // Extract the links from the data
            //     // links = links.map(el => el.querySelector('a').href)
            //     return links;
            // });
            resolve(dataObj);
            await newPage.close();
        });


        let currentPageData = {};
        for (link in urls) {
            currentPageData = await pagePromise(urls[link], link);
            // scrapedData.push(currentPageData);
            console.log(currentPageData);
        }

    }
}

module.exports = scraperObject;

