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
    async waitEditor(frameName = "frameEditor") {
        const waitTime = 90000;
        const frame = this.page
            .frames()
            .find((frame) => frame.name() === frameName);

        const isLoadingEditor = await frame.waitForFunction(
            () => {
                const elements = document.querySelectorAll(".asc-loadmask");
                return elements.length > 0;
            },
            { timeout: waitTime }
        );

        if (isLoadingEditor) {
            console.log("Loading the editor.");
        } else {
            console.log("Error loading the editor.");
        }

        const isLoadedEditor = await frame.waitForFunction(
            () => {
                const elements = document.querySelectorAll(".asc-loadmask");
                return elements.length === 0;
            },
            { timeout: waitTime }
        );

        if (isLoadedEditor) {
            console.log("The editor is loaded.");
        } else {
            console.log("Error loading the editor.");
        }
    }

    async load(url) {
        await this.page.goto(url);
    }
    async click(buttonSelectors, frameName = "frameEditor") {
        if (typeof buttonSelectors === "string") {
            buttonSelectors = [buttonSelectors];
        } else if (!Array.isArray(buttonSelectors)) {
            throw new Error("Error");
        }
        console.log(buttonSelectors);
        const frame = this.page
            .frames()
            .find((frame) => frame.name() === frameName);

        for (const buttonSelector of buttonSelectors) {
            await frame.waitForSelector(buttonSelector);
            await frame.click(buttonSelector);
        }
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
    async mouseClickInsideElement(selector, x, y, frameName = "frameEditor") {
        const frame = this.page
            .frames()
            .find((frame) => frame.name() === frameName);
        const elementHandle = await frame.$(selector);

        if (!elementHandle) {
            throw new Error(`Element with selector "${selector}" not found.`);
        }

        const boxModel = await elementHandle.boxModel();
        if (!boxModel) {
            throw new Error(
                `Element with selector "${selector}" has no box model.`
            );
        }
        const offset = {
            x: x,
            y: y,
        };
        await elementHandle.click({ offset: offset });
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

const fileName = "config_chrome.json";
const filePath = path.resolve(__dirname, "..", fileName);

fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
        console.error("File reading error:", err);
        return;
    }
    try {
        const config = JSON.parse(data);
        console.log("Contents of the JSON file:", config);
        const Tester = new TesterImp(config);
        await Tester.launch();
await Tester.load("https://doc-linux.teamlab.info/example/editor?fileName=new.docx");
await Tester.waitEditor();
await Tester.keyPress("Enter");
// type text
await Tester.input("Hello World!");
//await Tester.relativeClick('#id-toolbar-btn-bold', 10, 20)
await Tester.keyPress("ArrowLeft");
await Tester.keyDown("Shift");
for (let i = 0; i < 5; i++)
  await Tester.keyPress("ArrowLeft");
await Tester.keyUp("Shift");
// bold ???
await Tester.mouseClickInsideElement('#toolbar',81, 65);
//italic -> file
await Tester.click(['#id-toolbar-btn-italic', 'li[data-layout-name="toolbar-file"]']);
// if needed
await Tester.waitAutosave();
// await Tester.downloadFile("docx")
// await Tester.downloadFile("odt")
// await Tester.close(true);



    } catch (error) {
        console.error("Error when parsing JSON:", error);
    }
});
