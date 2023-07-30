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
        const frame = this.page
            .frames()
            .find((frame) => frame.name() === frameName);
        const fileButton = 'li[data-layout-name="toolbar-file"]';
        const extensionVal = `.svg-format-${extension}`;
        await frame.waitForSelector(fileButton);
        await frame.click(fileButton);
        if (extension === "rtf" || extension === "txt") {
            await frame.waitForSelector(extensionVal);
            await frame.click(extensionVal);
            await this.keyPress("Enter"); //разобраться как нормально реализовать
            await this.keyPress("Enter"); //+
        } else {
            await frame.waitForSelector(extensionVal);
            await frame.click(extensionVal);
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
