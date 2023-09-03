const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const fileName = __filename.replace(".runned.js", "");
const profilePath = path.join(
    __dirname,
    "..",
    "user_data",
    path.basename(fileName).replace(".js", "")
);
const cacheDir = path.resolve("./work_directory/cache");
/**
 * @class
 */
class TesterImp {
    /**
     * @constructor
     * @param {object} config
     */
    constructor(config) {
        const ww = 1000;
        const hh = 600;
        const options = {
            chrome: [
                "--disable-infobars",
                "--window-size=" + ww + "," + hh,
                "--disk-cache-dir=" + cacheDir,
            ],
            firefox: ["--width", "" + ww, "--height", "" + hh],
        };

        //options["firefox"] = [];

        this.browserOptions = {
            headless: false,
            slowMo: config.config.pressSlow,
            //executablePath: config.config.executablePath,
            args: options[config.browser],
            defaultViewport: { width: ww, height: hh, deviceScaleFactor: 1 },
        };

        if (config.browser === "firefox") {
            this.browserOptions.userDataDir = profilePath;
        }

        this.browser = config.browser;
        this.page = null;
        this.consoleLogFilter = "";
        this.consoleLogHandler = null;
        this.frame = "";
    }
    /**
     * @param {string} filter
     */
    setConsoleLogFilter(filter) {
        this.consoleLogFilter = filter;
    }
    /**
     * @param {Function} logHandler
     */
    attachConsoleLog(logHandler) {
        this.consoleLogHandler = logHandler;
    }

    /**
     * @param {string} newUrl
     */
    async setUrlParams(newUrl) {
        let url = this.page.url() + newUrl;
        await this.page.goto(url);
    }

    setupConsoleHandler() {
        this.page.on("console", (message) => {
            const messageText = message.text();
            if (this.consoleLogHandler) {
                if (messageText.startsWith(this.consoleLogFilter)) {
                    const filteredMessage = messageText.replace(
                        this.consoleLogFilter,
                        ""
                    );
                    FrameByName;
                    this.consoleLogHandler(filteredMessage);
                }
            }
        });
    }

    /**
     * @param {string} frameName
     * @returns {Promise<Puppeteer.Frame | null>}
     */
    async findFrameByName(frameName) {
        const frame = await this.page.waitForSelector(
            `iframe[name="${frameName}"]`
        );
        if (frame) {
            const currentFrame = this.page
                .frames()
                .find((frame) => frame.name() === frameName);
            return currentFrame;
        } else {
            throw new Error(
                "Invalid frame name or frame dofindFrameByNamees not exist"
            );
        }
    }
    /**
     * @returns {Promise<void>}
     */
    async launch() {
        this.browser = await puppeteer.launch(this.browserOptions);
        this.page = await this.browser.newPage();
        this.setupConsoleHandler();
        this.page.goto("https://doc-linux.teamlab.info/example/");
    }

    /**
     * @param {string} frameName
     * @returns {Promise<void>}
     */
    async waitEditor(frameName = "frameEditor") {
        const waitTime = 60000;
        this.frame = await this.findFrameByName(frameName);
        console.log("Loading the editor.");
        await this.page.waitForTimeout(3000);
        const isLoadedEditor = await this.frame.waitForFunction(
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
     * @param {string} toFile
     * @returns {Promise<void>}
     */
    async openFile(fileName, toFile = "file") {
        await this.page.waitForTimeout(5000);
        const promise = new Promise((resolve, reject) => {
            this.page.once("popup", (event) => {
                this.page = event;
                resolve();
            });
        });
        await this.uploadFile(fileName, toFile, "#fileupload", "none");
        await this.click("#cancelEdit", "none");
        await this.page.waitForTimeout(3000);
        await this.selectByText(
            fileName,
            `.scroll-table-body .tableRow > .contentCells`,
            "none"
        );
        await promise.then(async () => {
            await this.waitEditor();
        });
    }

    /**
     * @param {string} buttonName
     * @returns {Promise<void>}
     */
    async createFile(buttonName) {
        await this.page.waitForTimeout(5000);
        const promise = new Promise((resolve, reject) => {
            this.page.once("popup", (event) => {
                this.page = event;
                resolve();
            });
        });
        await this.selectByText(
            buttonName,
            ".try-editor-list.clearFix a",
            "none"
        );
        await promise.then(async () => {
            await this.waitEditor();
        });
    }

    /**
     * @param {string} encoding
     * @returns {Promise<void>}
     */
    async selectFileEncoding(encoding) {
        const encodingDropdown =
            '#id-codepages-combo button[data-toggle="dropdown"]';
        const okButton = 'button[result="ok"]';
        try {
            await this.page.waitForTimeout(5000);
            await this.click(encodingDropdown);
            const encodingElements = await this.frame.$$(
                "ul.dropdown-menu.scrollable-menu li div"
            );
            console.log(`Encoding Search: ${encoding}`);
            for (const encodingElement of encodingElements) {
                const text = await encodingElement.evaluate(
                    (el) => el.textContent
                );
                if (text.includes(encoding)) {
                    await encodingElement.click();
                    break;
                }
            }
            await this.click(okButton);
        } catch (error) {
            console.error("File Encoding not found");
        }
    }

    /**
     * @param {string|string[]} buttonSelectors
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async click(buttonSelectors, frameName = "frameEditor") {
        if (typeof buttonSelectors === "string") {
            buttonSelectors = [buttonSelectors];
        } else if (!Array.isArray(buttonSelectors)) {
            throw new Error("Error");
        }
        if (frameName === "none") {
            for (const buttonSelector of buttonSelectors) {
                await this.page.waitForSelector(buttonSelector);
                await this.page.click(buttonSelector);
            }
        } else {
            for (const buttonSelector of buttonSelectors) {
                await this.frame.waitForSelector(buttonSelector);
                await this.frame.click(buttonSelector);
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
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async mouseClickInsideElement(selector, x, y) {
        const offset = {
            x: x,
            y: y,
        };
        const elementHandle = await this.frame.$(selector);

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
     * @param {string} txtEncoding
     * @returns {Promise<void>}
     */
    async downloadFile(extension, txtEncoding = "Unicode (UTF-8)") {
        const fileButton = 'li[data-layout-name="toolbar-file"]';
        const extensionVal = `.svg-format-${extension}`;
        const dialogSelector = ".asc-window.modal.alert";
        const okButtonSelector = `${dialogSelector} button[result="ok"]`;
        if (extension === "rtf") {
            await this.click([
                fileButton,
                extensionVal,
                dialogSelector,
                okButtonSelector,
            ]);
        } else if (extension === "txt") {
            await this.click([fileButton, extensionVal, okButtonSelector]);
            await this.selectFileEncoding(txtEncoding);
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

            const fileInput = await this.page.$(selectorFileChooser);
            if (!fileInput) {
                throw new Error(
                    `File input element not found with selector: ${selectorFileChooser}`
                );
            }

            await fileInput.uploadFile(filePath);
        } catch (error) {
            throw new Error(`Error uploading file: ${error.message}`);
        }
    }

    /**
     * @param {string} inputText
     * @param {string} inputFormSelector
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async inputToForm(inputText, inputFormSelector) {
        try {
            if (typeof inputText !== "string") {
                inputText = String(inputText);
            }
            await this.frame.waitForSelector(inputFormSelector);
            const input = await this.frame.$(inputFormSelector);
            await input.type(inputText);
        } catch (error) {
            throw new Error(`Error inputting text to form: ${error.message}`);
        }
    }
    /**
     * @param {string} selector
     * @param {number} startX
     * @param {number} startY
     * @param {number} endX
     * @param {number} endY
     * @returns {Promise<void>}
     */
    async mouseDrawingLine(selector, startX, startY, endX, endY) {
        const canvasSelector = selector;
        const canvas = await this.frame.$(canvasSelector);

        if (!canvas) {
            throw new Error("Canvas element not found.");
        }

        const canvasBoundingBox = await canvas.boundingBox();

        if (!canvasBoundingBox) {
            throw new Error("Canvas element not visible.");
        }

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        const page = this.frame.page();
        const mouseDownX =
            canvasBoundingBox.x + startX + canvasBoundingBox.width / 2;
        const mouseDownY =
            canvasBoundingBox.y + startY + canvasBoundingBox.height / 2;
        await page.mouse.move(mouseDownX, mouseDownY);
        await page.mouse.down();

        const mouseX =
            canvasBoundingBox.x + startX + deltaX + canvasBoundingBox.width / 2;
        const mouseY =
            canvasBoundingBox.y +
            startY +
            deltaY +
            canvasBoundingBox.height / 2;

        await page.mouse.move(mouseX, mouseY);

        const mouseUpX =
            canvasBoundingBox.x + endX + canvasBoundingBox.width / 2;
        const mouseUpY =
            canvasBoundingBox.y + endY + canvasBoundingBox.height / 2;
        await page.mouse.move(mouseUpX, mouseUpY);
        await page.mouse.up();
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {Promise<void>}
     * @throws {Error}
     */
    async clickMouseInsideMain(x, y) {
        const canvasSelector = "#id_main_view > #id_viewer";
        const canvas = await this.frame.$(canvasSelector);

        if (!canvas) {
            throw new Error("Canvas element not found.");
        }

        const canvasBoundingBox = await canvas.boundingBox();
        if (!canvasBoundingBox) {
            throw new Error("Canvas element not visible.");
        }

        const page = this.frame.page();

        const mouseDownX =
            canvasBoundingBox.x + x + canvasBoundingBox.width / 2;
        const mouseDownY =
            canvasBoundingBox.y + y + canvasBoundingBox.height / 2;
        await page.mouse.click(mouseDownX, mouseDownY);
    }
    /**
     * @returns {Promise<void>}
     */
    async waitAutosave() {
        await this.page.waitForTimeout(3000);
    }

    /**
     * @param {string} selector
     * @returns {Promise<void>}
     */
    async selectDrowdown(selector) {
        const setDropdown = `${selector} .dropdown-toggle`;
        await this.click(setDropdown);
    }
    /**
     * @param {string} txt
     * @param {string} selector
     * @param {string} frameName
     * @returns {Promise<void>}
     */
    async selectByText(text, selector, frameName = "frameEditor") {
        let linkElement;
        if (frameName === "none") {
            linkElement = await this.page.evaluateHandle(
                (linkText, sel) => {
                    const links = Array.from(
                        document.querySelectorAll(`${sel}`)
                    );
                    return links.find(
                        (link) => link.textContent.trim() === linkText
                    );
                },
                text,
                selector
            );
        } else {
            linkElement = await this.frame.evaluateHandle(
                (linkText, sel) => {
                    const links = Array.from(
                        document.querySelectorAll(`${sel}`)
                    );
                    return links.find(
                        (link) => link.textContent.trim() === linkText
                    );
                },
                text,
                selector
            );
        }
        if (linkElement) {
            await linkElement.click();
        } else {
            console.error(`Element with text "${text}" not found.`);
        }
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

const configName = "%%CONFIG%%";
const filePath = path.resolve(__dirname, "..", configName);

fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
        console.error("File reading error:", err);
        return;
    }
    try {
        const config = JSON.parse(data);
        console.log(path.basename(fileName));
        console.log("Contents of the JSON file:", config);
        const Tester = new TesterImp(config);
        globalThis.Tester = Tester;
        "%%CODE%%"
    } catch (error) {
        throw new Error(`Error when parsing JSON: ${error}`);
    }
});
