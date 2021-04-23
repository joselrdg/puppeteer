#!/usr/bin/env node
const path = require('path');
var fs = require('fs');
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');
// puppeteer.use(require('puppeteer-extra-plugin-repl')())

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());


(async () => {
    const url = 'http://www.fci.be/es/nomenclature/1-Perros-de-pastor-y-perros-boyeros-excepto-perros-boyeros-suizos.html'
    const browser = await puppeteer.launch({ headless: true });
    // process.exit(31);
    // use tor
    //const browser = await puppeteer.launch({args:['--proxy-server=socks5://127.0.0.1:9050']});
    const page = await browser.newPage();

    // https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#pagegotourl-options
    const waittill = { timeout: 10000, waitUntil: ['networkidle2'] }
    await page.goto(url, waittill);
    console.log('uno')

    await page.exposeFunction("writeABString", async (strbuf, targetFile) => {

        const str2ab = function _str2ab(str) { // Convert a UTF-8 String to an ArrayBuffer

            let buf = new ArrayBuffer(str.length); // 1 byte for each char
            let bufView = new Uint8Array(buf);

            for (let i = 0, strLen = str.length; i < strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        }

        return new Promise((resolve, reject) => {

            // Convert the ArrayBuffer string back to an ArrayBufffer, which in turn is converted to a Buffer
            let buf = Buffer.from(str2ab(strbuf));

            // Try saving the file.        
            fs.writeFile(targetFile, buf, (err, text) => {
                if (err) reject(err);
                else resolve(targetFile);
            });
        });
    });


    await page.evaluate(async () => {

        function arrayBufferToString(buffer) { // Convert an ArrayBuffer to an UTF-8 String

            let bufView = new Uint8Array(buffer);
            let length = bufView.length;
            let result = '';
            let addition = Math.pow(2, 8) - 1;

            for (let i = 0; i < length; i += addition) {
                if (i + addition > length) {
                    addition = length - i;
                }
                result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
            }
            return result;
        }

        let geturl = '"http://www.fci.be/Nomenclature/Standards/166g01-es.pdf"';
        const filename = geturl.split('/').pop().replace(/\?.*$/, '');

        return fetch(geturl, {
            credentials: 'same-origin', // usefull when we are logged into a website and want to send cookies
            responseType: 'arraybuffer', // get response as an ArrayBuffer
        })
            .then(response => response.arrayBuffer())
            .then((arrayBuffer) => {
                let bufstring = arrayBufferToString(arrayBuffer);
                return window.writeABString(bufstring, `/tmp/razas/${filename}`);
            })
            .catch((error) => {
                console.log('Request failed: ', error);
            });
    });

    console.log(`My file is now located in /tmp/razas/`);

    // await page.repl()
    // await browser.repl()

    browser.close();
})();


