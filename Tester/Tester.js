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
     * @param {string} frameName
     * @returns {Promise<puppeteer.Frame | null>}
     */
    async findFrameByName(frameName) {
        const frame = this.page
            .frames()
            .find((frame) => frame.name() === frameName);
        if (frame) {
            return frame;
        } else {
            throw new Error("Invalid frame name or frame does not exist");
        }
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
        const frame = await this.findFrameByName(frameName);

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
     * @param {string|string[]} fileName
     * @param {string} [toFile="file"]
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async load(fileName, toFile = "file") {
        const urlMain = "https://doc-linux.teamlab.info/example/";
        await this.page.goto(urlMain);
        //todo
        if (fileName === "/") {
            const directoryPath = path.join(__dirname, "..", "common", "file");
            const files = fs.readdirSync(directoryPath);
            const filteredFiles = files.filter(
                (file) => path.extname(file) === ".docx"
            );
            fileName = filteredFiles;
        } else if (typeof fileName === "string") {
            fileName = [fileName];
        } else if (!Array.isArray(fileName)) {
            throw new Error("Error");
        }

        for (const file of fileName) {
            await this.uploadFile(file, toFile, ".file-upload", "");
            await this.click("#cancelEdit", "");
        }
    }
    /**
     * @param {string} fileName
     * @param {string} frameName
     * @returns {Promise<void>}
     */
    async goToFile(fileName, frameName = "frameEditor") {
        const okButtonSelector = '#window-view684 button[result="ok"]';
        const waitTime = 5000;
        const urlFile = `https://doc-linux.teamlab.info/example/editor?fileName=${fileName}`;

        await this.page.goto(urlFile);
        const frame = await this.findFrameByName(frameName);

        try {
            //todo
            await frame.waitForSelector(okButtonSelector, {
                timeout: waitTime,
            }),
                await this.click(okButtonSelector);
            await this.waitEditor(frameName);
        } catch (error) {
            await this.waitEditor(frameName);
        }
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
        if (frameName === "") {
            for (const buttonSelector of buttonSelectors) {
                await this.page.waitForSelector(buttonSelector);
                await this.page.click(buttonSelector);
            }
        } else {
            for (const buttonSelector of buttonSelectors) {
                const frame = await this.findFrameByName(frameName);
                await frame.waitForSelector(buttonSelector);
                await frame.click(buttonSelector);
            }
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
        const frame = await this.findFrameByName(frameName);
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
            const frame = await this.findFrameByName(frameName);
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
     * @param {string} fileName
     * @param {string} toFile
     * @param {string} selectorFileChooser
     * @param {string} frameName
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async uploadFile(
        fileName,
        toFile,
        selectorFileChooser,
        frameName = "frameEditor"
    ) {
        try {
            const filePath = path.join(
                __dirname,
                "..",
                "common",
                toFile,
                fileName
            );
            const [fileChooser] = await Promise.all([
                this.page.waitForFileChooser(),
                this.click([selectorFileChooser], frameName),
            ]);
            await fileChooser.accept([filePath]);
        } catch (error) {
            throw new Error(`Error uploading file: ${error.message}`);
        }
    }

    /**
     * @param {string} inputText
     * @param {string} inputFormSelector
     * @param {string} frameName
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async inputToForm(inputText, inputFormSelector, frameName = "frameEditor") {
        try {
            const frame = await this.findFrameByName(frameName);
            await frame.waitForSelector(inputFormSelector);
            const input = await frame.$(inputFormSelector);
            await input.type(`${inputText}`);
        } catch (error) {
            throw new Error(`Error inputting text to form: ${error.message}`);
        }
    }
    /**
     * @param {number} endX
     * @param {number} endY
     * @returns {Promise<void>}
     */
    async mouseDrawingLine(endX, endY) {
        const elementSelector = "#id_main_view";
        const frame = await this.findFrameByName("frameEditor");
        const elementHandle = await frame.$(elementSelector);

        if (!elementHandle) {
            throw new Error(
                `Element with selector "${elementSelector}" not found.`
            );
        }

        await elementHandle.hover();

        console.log("Dragging to:", endX, endY);

        await elementHandle.mouse.down({ button: "left" });
        await this.page.mouse.move(endX, endY);
        await this.page.mouse.up({ button: "left" });
    }
    /**
     * @param {string} drawOption
     * @param {string} color
     * @param {Number} size
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async drawFunction(drawOption, color, size = 1) {
        const drawButton = 'li a[data-tab="draw"][data-title="Draw"]';
        const penOne = [
            "#asc-gen592 > button",
            "#asc-gen592 > button.dropdown-toggle",
            `#asc-gen592 div > a[color-name="${color}"]`,
        ];
        await this.click([drawButton]);
        if (drawOption === "pen_1") {
            await this.click(penOne);
            await this.mouseDrawingLine(40, 50);
        } else if (drawOption === "pen_2") {
        } else if (drawOption === "highlighter") {
        } else {
            throw new Error("Invalid draw option");
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
