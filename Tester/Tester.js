const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
class TesterImp {
    constructor(config) {
        this.browserOptions = {
            headless: false,
            slowMo: config.config.pressSlow,
            executablePath: config.config.executablePath,
        };
        this.browser = config.browser;
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
}

const fileName = "%%CONFIG%%";
const filePath = path.resolve(__dirname, "..", fileName);

fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
        console.error("File reading error:", err);
        return;
    }
    try {
        const config = JSON.parse(data);
        console.log("Contents of the JSON file:", config);
        const Tester = new TesterImp(config);
        (async () => {
            "%%CODE%%";
        })();
    } catch (error) {
        console.error("Error when parsing JSON:", error);
    }
});
