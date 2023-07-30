const puppeteer = require("puppeteer");

module.exports = class Tester {
    constructor(config) {
        this.browserOptions = {
            headless: false,
            slowMo: config.pressSlow || null,
            executablePath: config.executablePath || null,
        };
        this.browser = null;
        this.page = null;
    }

    async launch() {
        this.browser = await puppeteer.launch(this.browserOptions);
        this.page = await this.browser.newPage();
    }

    async waitEditor() {
        await this.page.waitForTimeout(10000); //доделать
    }

    async load(url) {
        await this.page.goto(url);
    }
    async click(buttonId, frameName = "frameEditor") {
        const frame = this.page
            .frames()
            .find((frame) => frame.name() === frameName);
        await frame.waitForSelector(buttonId);
        await frame.click(buttonId);
    }

    async input(text) {
        await this.page.keyboard.type(text);
    }
    async keyPress(key) {
        await this.page.keyboard.press(key);
    }
    async keyDown(key) {
        await this.page.keyboard.down(key);
    }
    async keyUp(key) {
        await this.page.keyboard.up(key);
    }
    async mouseClick(x, y) {
        this.page.mouse.click(x, y);
    }

    async downloadFile(extension, frameName = "frameEditor") {
        const fileType = {
            docx: 1,
            pdf: 2,
            odt: 3,
            docxf: 4,
            oform: 5,
            dotx: 7,
            pdfa: 8,
            ott: 9,
            rtf: 11,
            txt: 12,
            fb2: 13,
            epub: 14,
            html: 15,
            jpg: 17,
            png: 18,
        };
        let frame = this.page
            .frames()
            .find((frame) => frame.name() === frameName);
        const fileButton =
            "#toolbar > div > div.box-tabs > section > ul > li.ribtab.x-lone.canedit > a";
        const number = fileType[extension];
        const extensionVal = `#panel-saveas > div.content-container > div.format-items > div:nth-child(${number}) > div > div`;
        await frame.waitForSelector(fileButton);
        await frame.click(fileButton);
        if (number) {
            if (number === fileType.txt || number === fileType.rtf) {
                await frame.waitForSelector(extensionVal);
                await frame.click(extensionVal);
                await this.keyDown("Enter"); //разобраться как нормально реализовать
                await this.keyDown("Enter"); //+
            } else {
                await frame.waitForSelector(extensionVal);
                await frame.click(extensionVal);
            }
        } else {
            console.log("Invalid file extension.");
        }
    }

    async waitAutosave() {
        await this.page.waitForTimeout(3000);
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
};
