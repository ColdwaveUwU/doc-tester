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
    /**
     * @returns {Promise<void>}
     */
    async launch() {
        this.browser = await puppeteer.launch(this.browserOptions);
        this.page = await this.browser.newPage();
    }
    /**
     * @param {string} [frameName="frameEditor"]
     * @returns {Promise<void>}
     */
    async waitEditor(frameName = "frameEditor") {
        const waitTime = 60000;
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
    /**
     * @param {string} fileName
     * @returns {Promise<void>}
     */
    async load(fileName) {
        const url = `https://doc-linux.teamlab.info/example/editor?fileName=${fileName}`;
        await this.page.goto(url);
    }
    /**
     * @param {string|string[]} buttonSelectors
     * @param {string} [frameName="frameEditor"]
     * @throws {Error}
     * @returns {Promise<void>}
     */
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
    /**
     * @param {string} text
     * @returns {Promise<void>}
     */
    async input(text) {
        await this.page.keyboard.type(text);
    }
    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async keyPress(key) {
        await this.page.keyboard.press(key);
    }
    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async keyDown(key) {
        await this.page.keyboard.down(key);
    }
    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async keyUp(key) {
        await this.page.keyboard.up(key);
    }
    /**
     * @param {string} selector
     * @param {number} x
     * @param {number} y
     * @param {string} [frameName="frameEditor"]
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async mouseClickInsideElement(selector, x, y, frameName = "frameEditor") {
        const offset = {
            x: x,
            y: y,
        };

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
        await elementHandle.click({ offset: offset });
    }
    /**
     * @param {string} extension
     * @param {string} [txtEncoding="Unicode (UTF-8)"]
     * @param {string} [frameName="frameEditor"]
     * @returns {Promise<void>}
     */
    async downloadFile(
        extension,
        txtEncoding = "Unicode (UTF-8)",
        frameName = "frameEditor"
    ) {
        const fileButton = 'li[data-layout-name="toolbar-file"]';
        const extensionVal = `.svg-format-${extension}`;
        const dialogSelector = ".asc-window.modal.alert.notransform";
        const okButtonSelector = `${dialogSelector} button[result="ok"]`;
        const elementSelector = "button.btn.btn-default.dropdown-toggle";
        if (extension === "rtf") {
            await this.click([
                fileButton,
                extensionVal,
                dialogSelector,
                okButtonSelector,
            ]);
        } else if (extension === "txt") {
            // Node is either not clickable or not an HTMLElement
            await this.click([fileButton, extensionVal, okButtonSelector]);
            const frame = this.page
                .frames()
                .find((frame) => frame.name() === frameName);
            const elementExists = await frame.evaluate((selector) => {
                const element = document.querySelector(selector);
                return element !== null;
            }, elementSelector);
            console.log(elementExists); //true
            if (elementExists) {
                await this.click(".dropdown-toggle");
            }
        } else {
            await this.click([fileButton, extensionVal]);
        }
    }
    /**
     * @typedef {'from_file' | 'from_url' | 'from_storage'} InsertOption
     * @param {string} file
     * @param {InsertOption} insertOption
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async insertPicture(file, insertOption = "From_File") {
        insertOption = insertOption.toLowerCase();
        const frameName = "frameEditor";
        const insertButton = 'li a[data-tab="ins"][data-title="Insert"]';
        const imageButton = "#slot-btn-insimage";
        const filePath = path.join(__dirname, "picture", `${file}`);

        await this.click([insertButton, imageButton]);
        if (insertOption === "from_file") {
            const fromFile = "#asc-gen237";
            const [fileChooser] = await Promise.all([
                this.page.waitForFileChooser(),
                this.click(fromFile),
            ]);

            await fileChooser.accept([filePath]);
        } else if (insertOption === "from_url") {
            const fromUrlSelector = "#asc-gen239";
            const inputFormSelector = "input.form-control";
            const okButtonSelector = 'button[result="ok"]';
            await this.click(fromUrlSelector);
            const frame = this.page
                .frames()
                .find((frame) => frame.name() === frameName);
            await frame.waitForSelector(inputFormSelector);
            const input = await frame.$(inputFormSelector);
            await input.type(`${file}`);
            await this.click(okButtonSelector);
        } else if (insertOption === "from_storage") {
            const fromStorageSelector = "#asc-gen241";
            await this.click(fromStorageSelector);
        } else {
            throw new Error("Incorrect file insertion method");
        }
    }
    /**
     * @returns {Promise<void>}
     */
    async waitAutosave() {
        await this.page.waitForTimeout(3000);
    }
    /**
     * @returns {Promise<void>}
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

const fileName = "%%CONFIG%%";
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
        "%%CODE%%"
    } catch (error) {
        console.error("Error when parsing JSON:", error);
    }
});
