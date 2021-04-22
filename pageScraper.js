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
        return urls
    }
}

module.exports = scraperObject;


