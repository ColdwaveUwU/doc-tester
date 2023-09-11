const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { error } = require("console");

const fileName = __filename.replace(".runned.js", "");
const profilePath = path.join(
    __dirname,
    "..",
    "user_data",
    path.basename(fileName).replace(".js", "")
);
const cacheDir = path.resolve("./work_directory/cache");
/**
 * @typedef {JSON} Config
 */
class TesterImp {
    /**
     * @param {Config} config
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
        this.frame = "";
        this.url = config.url;

        this.urlDebug = [];
        this.consoleLogFilter = "";
        this.consoleLogHandlers = [];
        this.debugMode = false;
    }
    /**
     * @returns {Promise<void>}
     * @throws {Error}
     */
    async waitLoadMask() {
        try {
            const waitTime = 60000;
            const isLoaded = await this.frame.waitForFunction(
                () => {
                    const elements = document.querySelectorAll(".asc-loadmask");
                    return elements.length === 0 && elements;
                },
                { timeout: waitTime }
            );
            return isLoaded;
        } catch (error) {
            throw new Error(`Error with waiting loadmask: ${error.message}`);
        }
    }
    /**
     * @param {string} filter
     */
    setConsoleLogFilter(filter) {
        this.consoleLogFilter = filter;
    }
    /**
     * @param {Array<Function>} logHandler
     */
    attachConsoleLog(logHandler) {
        this.consoleLogHandlers.push(logHandler);
    }
    /**
     * @param {string} newUrl
     */
    setUrlParams(newUrl) {
        this.debugMode = true;
        this.urlDebug = newUrl;
    }
    /**
     * @returns {Promise<void>}
     */
    async setupConsoleHandler() {
        try {
            this.page.on("console", (message) => {
                const messageText = message.text();
                if (this.consoleLogHandlers.length > 0) {
                    for (const logHandler of this.consoleLogHandlers) {
                        if (messageText.startsWith(this.consoleLogFilter)) {
                            const filteredMessage = messageText.replace(
                                this.consoleLogFilter,
                                ""
                            );
                            logHandler(filteredMessage);
                        }
                    }
                }
            });
        } catch (error) {
            throw new Error(`Error setupConsoleHandler: ${error.message}`);
        }
    }
    /**
     * @returns {Promise<void>}
     */
    async checkDebugUrl() {
        try {
            let urlDebug = this.urlDebug;
            const pageUrl = this.page.url() + "&";
            if (typeof urlDebug === "string") {
                urlDebug = [urlDebug];
            }
            if (urlDebug.length !== 0) {
                let filteredUrl = urlDebug.reduce((acc, val) => {
                    if (pageUrl.includes(val)) {
                        return acc;
                    } else {
                        return [...acc, val];
                    }
                }, []);
                if (filteredUrl === 0) {
                    console.log("The parameters are already set in the url");
                } else {
                    const resUrl = filteredUrl.join("&");
                    await this.page.goto(pageUrl + resUrl);
                }
            } else {
                throw new Error("Set debug parameters");
            }
        } catch (error) {
            throw new Error(`Error with checkDebugUrl: ${error.message}`);
        }
    }

    /**
     * @param {string} frameName
     * @returns {Promise<Puppeteer.Frame>}
     */
    async findFrameByName(frameName) {
        try {
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
        } catch (error) {
            throw new Error(`Error findFrameByName: ${error.message}`);
        }
    }
    /**
     * @returns {Promise<void>}
     */
    async launch() {
        try {
            this.browser = await puppeteer.launch(this.browserOptions);
            this.page = await this.browser.newPage();
            this.page.goto(this.url);
            await this.page.waitForNavigation();
        } catch (error) {
            throw new Error(`Error launch: ${error.message}`);
        }
    }

    /**
     * @param {string} frameName
     * @returns {Promise<void>}
     */
    async waitEditor(frameName = "frameEditor") {
        try {
            const isPageLoaded = await this.page.evaluate(() => {
                return document.readyState === "complete";
            });
            await isPageLoaded;
            this.frame = await this.findFrameByName(frameName);
            console.log("Loading the editor.");
            if (await this.waitLoadMask()) {
                console.log("The editor is loaded.");
            } else {
                console.log("Error loading the editor.");
            }
        } catch (error) {
            throw new Error(`Error waitEditor: ${error.message}`);
        }
    }
    /**
     * @param {string} fileName
     * @param {string} toFile
     * @returns {Promise<void>}
     */
    async openFile(fileName, toFile = "file") {
        try {
            const promise = new Promise((resolve, reject) => {
                this.page.once("popup", (event) => {
                    this.page = event;
                    resolve();
                });
            });
            await this.uploadFile(fileName, toFile, "#fileupload", "none");
            await this.click("#cancelEdit", "none");
            await this.selectByText(
                fileName,
                `.scroll-table-body .tableRow > .contentCells`,
                "none"
            );
            await promise.then(async () => {
                if (this.debugMode === true) {
                    await this.setupConsoleHandler();
                    await this.checkDebugUrl();
                }
                await this.waitEditor();
            });
        } catch (error) {
            throw new Error(`Error openFile: ${error.message}`);
        }
    }

    /**
     * @param {string} buttonName
     * @returns {Promise<void>}
     */
    async createFile(buttonName) {
        try {
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
                if (this.debugMode === true) {
                    await this.setupConsoleHandler();
                    await this.checkDebugUrl();
                }
                await this.waitEditor();
            });
        } catch (error) {
            throw new Error(`Error createFile: ${error.message}`);
        }
    }

    /**
     * @param {string} encoding
     * @returns {Promise<void>}
     */
    async selectFileEncoding(encoding) {
        try {
            const encodingDropdown =
                '#id-codepages-combo button[data-toggle="dropdown"]';
            const okButton = 'button[result="ok"]';
            if (await this.waitLoadMask()) {
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
            }
        } catch (error) {
            throw new Error(`Error selectFileEncoding: ${error.message}`);
        }
    }

    /**
     * @param {string|string[]} buttonSelectors
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async click(buttonSelectors, frameName = "frameEditor") {
        try {
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
                if (await this.waitLoadMask()) {
                    for (const buttonSelector of buttonSelectors) {
                        await this.frame.waitForSelector(buttonSelector);
                        await this.frame.click(buttonSelector);
                    }
                }
            }
        } catch (error) {
            throw new Error(`Error click: ${error.message}`);
        }
    }
    /**
     * @param {string} text
     * @returns {Promise<void>}
     */
    async input(text) {
        try {
            await this.page.keyboard.type(text);
        } catch (error) {
            throw new Error(`Error input: ${error.message}`);
        }
    }
    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async keyPress(key) {
        try {
            await this.page.keyboard.press(key);
        } catch (error) {
            throw new Error(`Error keyPress: ${error.message}`);
        }
    }
    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async keyDown(key) {
        try {
            await this.page.keyboard.down(key);
        } catch (error) {
            throw new Error(`Error keyDown: ${error.message}`);
        }
    }
    /**
     * @param {string} key
     * @returns {Promise<void>}
     */
    async keyUp(key) {
        try {
            await this.page.keyboard.up(key);
        } catch (error) {
            throw new Error(`Error keyUp: ${error.message}`);
        }
    }
    /**
     * @param {string} selector
     * @param {number} x
     * @param {number} y
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async mouseClickInsideElement(selector, x, y) {
        try {
            const offset = {
                x: x,
                y: y,
            };
            const elementHandle = await this.frame.$(selector);

            if (!elementHandle) {
                throw new Error(
                    `Element with selector "${selector}" not found.`
                );
            }

            const boxModel = await elementHandle.boxModel();
            if (!boxModel) {
                throw new Error(
                    `Element with selector "${selector}" has no box model.`
                );
            }
            await elementHandle.click({ offset: offset });
        } catch (error) {
            throw new Error(`Error mouseClickInsideElement: ${error.message}`);
        }
    }
    /**
     * @param {string} extension
     * @param {string} txtEncoding
     * @returns {Promise<void>}
     */
    async downloadFile(extension, txtEncoding = "Unicode (UTF-8)") {
        try {
            const fileButton = 'li[data-layout-name="toolbar-file"]';
            const extensionVal = `.svg-format-${extension}`;
            const dialogSelector = ".asc-window.modal.alert";
            const okButtonSelector = `${dialogSelector} button[result="ok"]`;
            if (await this.waitLoadMask()) {
                if (extension === "rtf") {
                    await this.click([
                        fileButton,
                        extensionVal,
                        dialogSelector,
                        okButtonSelector,
                    ]);
                } else if (extension === "txt") {
                    await this.click([
                        fileButton,
                        extensionVal,
                        okButtonSelector,
                    ]);
                    await this.selectFileEncoding(txtEncoding);
                } else {
                    await this.click([fileButton, extensionVal]);
                }
            }
        } catch (error) {
            throw new Error(`Error downloadFile: ${error.message}`);
        }
    }

    /**
     * @param {string} fileName
     * @param {string} toFile
     * @param {string} selectorFileChooser
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async uploadFile(fileName, toFile, selectorFileChooser) {
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
            if (await this.waitLoadMask()) {
                await this.frame.waitForSelector(inputFormSelector);
                const input = await this.frame.$(inputFormSelector);
                await input.type(inputText);
            }
        } catch (error) {
            throw new Error(`Error inputToForm: ${error.message}`);
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
        try {
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
                canvasBoundingBox.x +
                startX +
                deltaX +
                canvasBoundingBox.width / 2;
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
        } catch (error) {
            throw new Error(`Error mouseDrawingLine: ${error.message}`);
        }
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {Promise<void>}
     * @throws {Error}
     */
    async clickMouseInsideMain(x, y) {
        try {
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
        } catch (error) {
            throw new Error(`Error clickMouseInsideMain: ${error.message}`);
        }
    }
    /**
     * @returns {Promise<void>}
     */
    async waitAutosave() {
        try {
            await this.page.waitForTimeout(3000);
        } catch (error) {
            throw new Error(`Error waitAutosave: ${error.message}`);
        }
    }

    /**
     * @param {string} selector
     * @returns {Promise<void>}
     */
    async selectDropdown(selector) {
        try {
            const setDropdown = `${selector} .dropdown-toggle`;
            await this.click(setDropdown);
        } catch (error) {
            throw new Error(`Error selectDropdown: ${error.message}`);
        }
    }
    /**
     * @param {string} txt
     * @param {string} selector
     * @param {string} frameName
     * @returns {Promise<void>}
     */
    async selectByText(text, selector, frameName = "frameEditor") {
        try {
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
            }
        } catch (error) {
            throw new Error(`Error selectByText: ${error.message}`);
        }
    }

    /**
     * @returns {Promise<void>}
     */
    async close() {
        try {
            if (this.browser) {
                await this.browser.close();
                this.browser = null;
            }
        } catch (error) {
            throw new Error(`Error close: ${error.message}`);
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
