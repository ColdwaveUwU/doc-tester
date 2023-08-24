const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const fileName = __filename.replace(".runned.js", "");
const profilePath = path.join(
    __dirname,
    "..",
    "user_data",
    path.basename(fileName).replace(".js", ""),
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
        var ww = 1000;
        var hh = 600;
        var options = {
            chrome: [
                "--disable-infobars",
                "--window-size=" + ww + "," + hh,
                "--disk-cache-dir=" + cacheDir,
            ],
            firefox: [
                "-width",
                "" + ww,
                "-height",
                "" + hh,
                "--p",
                "firefox-test-profile",
            ],
        };

        //options["firefox"] = [];

        this.browserOptions = {
            headless: false,
            slowMo: config.config.pressSlow,
            //executablePath: config.config.executablePath,
            args: options[config.browser],
            defaultViewport: { width: ww, height: hh, deviceScaleFactor: 1 },
            userDataDir: profilePath
        };
        this.browser = config.browser;
        this.page = null;
    }
    /**
     * @param {string} frameName
     * @returns {Puppeteer.Frame | null}
     */
    findFrameByName(frameName) {
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
        this.page.goto("https://doc-linux.teamlab.info/example/");
    }
    /**
     * @param {string} frameName
     * @returns {Promise<void>}
     */
    async waitEditor(frameName = "frameEditor") {
        const waitTime = 60000;
        const frame = this.findFrameByName(frameName);

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
        await this.uploadFile(fileName, toFile, ".file-upload", "none");
        await this.click("#cancelEdit", "none");
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
     * @param {string} frameName
     * @returns {Promise<void>}
     */
    async selectFileEncoding(encoding, frameName = "frameEditor") {
        const encodingDropdown =
            '#id-codepages-combo button[data-toggle="dropdown"]';
        const okButton = 'button[result="ok"]';
        try {
            await this.page.waitForTimeout(5000);
            await this.click(encodingDropdown);
            const frame = await this.findFrameByName(frameName);
            const encodingElements = await frame.$$(
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
     * @param {string} frameName
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
     * @param {string} frameName
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async mouseClickInsideElement(selector, x, y, frameName = "frameEditor") {
        const offset = {
            x: x,
            y: y,
        };
        const frame = this.findFrameByName(frameName);
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
            console.log(filePath)
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
            if (typeof inputText !== "string") {
                inputText = String(inputText);
            }
            const frame = this.findFrameByName(frameName);
            await frame.waitForSelector(inputFormSelector);
            const input = await frame.$(inputFormSelector);
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
     * @param {string} frameName
     * @returns {Promise<void>}
     */
    async mouseDrawingLine(
        selector,
        startX,
        startY,
        endX,
        endY,
        frameName = "frameEditor"
    ) {
        const frame = this.findFrameByName(frameName);
        const canvasSelector = selector;
        const canvas = await frame.$(canvasSelector);

        if (!canvas) {
            throw new Error("Canvas element not found.");
        }

        const canvasBoundingBox = await canvas.boundingBox();

        if (!canvasBoundingBox) {
            throw new Error("Canvas element not visible.");
        }

        const deltaX = endX - startX;
        const deltaY = endY - startY;

        const page = frame.page();
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
     * @param {string} frameName
     * @returns {Promise<void>}
     * @throws {Error}
     */
    async clickMouseInsideMain(x, y, frameName = "frameEditor") {
        const frame = this.findFrameByName(frameName);
        const canvasSelector = "#id_main_view > #id_viewer";
        const canvas = await frame.$(canvasSelector);

        if (!canvas) {
            throw new Error("Canvas element not found.");
        }

        const canvasBoundingBox = await canvas.boundingBox();
        if (!canvasBoundingBox) {
            throw new Error("Canvas element not visible.");
        }

        const page = frame.page();

        const mouseDownX =
            canvasBoundingBox.x + x + canvasBoundingBox.width / 2;
        const mouseDownY =
            canvasBoundingBox.y + y + canvasBoundingBox.height / 2;
        await page.mouse.click(mouseDownX, mouseDownY);
    }
    /**
     * @param {string} drawOption
     * @param {string} color
     * @param {number} size
     * @throws {Error}
     * @returns {Promise<void>}
     */
    async drawFunction(drawOption, color, size = 1) {
        const drawButtonSelector = 'li a[data-tab="draw"][data-title="Draw"]';
        const drawMethods = {
            pen_1: "#slot-btn-draw-pen-0",
            pen_2: "#slot-btn-draw-pen-1",
            highlighter: "#slot-btn-draw-pen-2",
        };
        const drawMethodsButton = ".inner-box-icon";
        const dropdownColorPanel = "button.dropdown-toggle";
        const drawMethodsColor = `div > a[color-name="${color}"]`;

        let selectedOption = null;

        switch (drawOption) {
            case "pen_1":
                selectedOption = [
                    `${drawMethods.pen_1} ${drawMethodsButton}`,
                    `${drawMethods.pen_1} ${dropdownColorPanel}`,
                    `${drawMethods.pen_1}  ${drawMethodsColor}`,
                ];
                break;

            case "pen_2":
                selectedOption = [
                    `${drawMethods.pen_2} ${drawMethodsButton}`,
                    `${drawMethods.pen_2} ${dropdownColorPanel}`,
                    `${drawMethods.pen_2}  ${drawMethodsColor}`,
                ];
                break;

            case "highlighter":
                selectedOption = [
                    `${drawMethods.highlighter} ${drawMethodsButton}`,
                    `${drawMethods.highlighter} ${dropdownColorPanel}`,
                    `${drawMethods.highlighter}  ${drawMethodsColor}`,
                ];
                break;

            default:
                throw new Error("Invalid draw option");
        }

        const [penSelector, dropdownToggleSelector, colorSelector] =
            selectedOption;

        await this.click([
            drawButtonSelector,
            penSelector,
            dropdownToggleSelector,
            colorSelector,
        ]);
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
            const frame = this.findFrameByName(frameName);
            linkElement = await frame.evaluateHandle(
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
