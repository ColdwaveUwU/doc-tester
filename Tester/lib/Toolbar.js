const Color = require("../lib/Color");
module.exports = {
    clickHome: async function () {
        await Tester.click('li a[data-title="Home"]');
    },

    clickBold: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-bold");
    },

    clickItalic: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-italic");
    },

    clickUnderline: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-underline");
    },

    clickStrikeout: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-strikeout");
    },

    clickSuperscript: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-superscript");
    },

    clickSubscript: async function () {
        await clickHome();
        await Tester.click("#id-toolbar-btn-subscript");
    },

    clickIncFont: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-incfont");
    },

    clickDecFont: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-decfont");
    },

    setFontSize: async function (size) {
        await this.clickHome();
        await Tester.click("#slot-field-fontsize");
        await Tester.input(size);
    },

    selectFontSize: async function (size) {
        await this.clickHome();
        await Tester.selectDrowdown("#slot-field-fontsize");
        await Tester.selectByText(size, "#slot-field-fontsize ul.dropdown-menu a");
    },

    clickHightlight: async function (color) {
        await this.clickHome();
        await Color.colorHightlight("#id-toolbar-btn-highlight", color);
    },

    clickChangeCase: async function (textCase) {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-case");
        await Tester.selectByText(textCase, "#id-toolbar-btn-case ul.dropdown-menu a");
    },

    clickFontColor: async function (color) {
        await this.clickHome();
        await Color.fontColor("#id-toolbar-btn-fontcolor", color);
    },

    clickBullets: async function (bullet) {
        bullet.toLowerCase().trim();
        await this.clickHome();
        const bulletLibrary = {
            none: ".item:nth-child(1)",
            filledroundbullets: ".item:nth-child(2)",
            hollowroundbullets: ".item:nth-child(3)",
            filledsquarebullets: ".item:nth-child(4)",
            starbullets: ".item:nth-child(5)",
            arrowbullets: ".item:nth-child(6)",
            checkmarkbullets: ".item:nth-child(7)",
            filledrhombusbullets: ".item:nth-child(8)",
            dashbullets: ".item:nth-child(9)",
        };
        const selectedBulletSelector = bulletLibrary[bullet];
        await Tester.selectDrowdown("#id-toolbar-btn-markers");
        if (selectedBulletSelector) {
            await Tester.click(selectedBulletSelector);
        } else {
            console.error(`Unknown bullet type: ${bullet}`);
        }
    },

    clickNumbering: async function (numbering) {
        await this.clickHome();
        const numberingContainer = "#menu-numbering-group-lib";
        const numberingLibrary = {
            none: `${numberingContainer} .item:nth-child(1)`,
            A: `${numberingContainer} .item:nth-child(2)`,
            aDot: `${numberingContainer} .item:nth-child(3)`,
            aBrace: `${numberingContainer} .item:nth-child(4)`,
            numberDot: `${numberingContainer} .item:nth-child(5)`,
            numberBrace: `${numberingContainer} .item:nth-child(6)`,
            iDot: `${numberingContainer} .item:nth-child(7)`,
            iBrace: `${numberingContainer} .item:nth-child(8)`,
        };
        const selectedNumberingSelector = numberingLibrary[numbering];
        await Tester.selectDrowdown("#id-toolbar-btn-numbering");
        if (selectedNumberingSelector) {
            await Tester.click(selectedNumberingSelector);
        } else {
            console.error(`Unknown bullet type: ${numbering}`);
        }
    },

    clickMultilevels: async function (multilevels) {
        await this.clickHome();
        const multilevelsContainer = "#id-toolbar-menu-multilevels";
        const multilevelsLibrary = {
            none: `${multilevelsContainer} .item:nth-child(1)`,
            variosnumbullets: `${multilevelsContainer} .item:nth-child(2)`,
            numbered: `${multilevelsContainer} .item:nth-child(3)`,
            symbols: `${multilevelsContainer} .item:nth-child(4)`,
            articles: `${multilevelsContainer} .item:nth-child(5)`,
            chapters: `${multilevelsContainer} .item:nth-child(6)`,
            numberedheadings: `${multilevelsContainer} .item:nth-child(7)`,
            variosheadings: `${multilevelsContainer} .item:nth-child(8)`,
        };
        const selectedMultilevelsSelector = multilevelsLibrary[multilevels];
        await Tester.selectDrowdown("#id-toolbar-btn-multilevels");
        if (selectedMultilevelsSelector) {
            await Tester.click(selectedMultilevelsSelector);
        } else {
            console.error(`Unknown bullet type: ${multilevels}`);
        }
    },

    clickAlignLeft: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-align-left");
    },

    clickAlignCenter: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-align-center");
    },

    clickAlignRight: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-align-right");
    },

    clickJustified: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-align-just");
    },

    selectFont: async function (font) {
        await this.clickHome();
        await Tester.click("#slot-field-fontname");
        await Tester.inputToForm(font, "#slot-field-fontname .form-control");
        await Tester.keyPress("Enter");
    },

    clickDecIndent: async function () {
        await this.clickHome();
        await Tester.click("#slot-btn-decoffset");
    },

    clickIncIndent: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-incoffset");
    },

    selectNonPrintChar: async function (select) {
        await this.clickHome();
        await Tester.selectDrowdown("#id-toolbar-btn-hidenchars");

        switch (select) {
            case "nonprint":
                await Tester.click(
                    "#id-toolbar-btn-hidenchars li:nth-child(1)"
                );
                break;
            case "hidden":
                await Tester.click(
                    "#id-toolbar-btn-hidenchars li:nth-child(2)"
                );
                break;
            case "all":
                await Tester.click(
                    "#id-toolbar-btn-hidenchars li:nth-child(1)"
                );
                await Tester.selectDrowdown("#id-toolbar-btn-hidenchars");
                await Tester.click(
                    "#id-toolbar-btn-hidenchars li:nth-child(2)"
                );
                break;
            default:
                console.log("Input select");
                break;
        }
    },

    clickShading: async function (color) {
        await this.clickHome();
        await Color.shadingColor("#id-toolbar-btn-paracolor", color);
    },

    selectShadingCombo: async function (squareCoord = [0, 0], recY = 0) {
        await this.clickHome();
        await Color.selectColorCombo(
            "#id-toolbar-btn-paracolor",
            squareCoord,
            recY
        );
        await Tester.click(".footer.center > button");
    },

    selectShadingColorByText: async function (R, G, B, grid) {
        await this.clickHome();
        await Color.selectColorComboByInput(
            "#id-toolbar-btn-paracolor",
            R,
            G,
            B,
            grid
        );
        await Tester.click(".footer.center > button");
    },

    clickClearStyle: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-clearstyle");
    },

    selectFontCombo: async function (squareCoord = [0, 0], recY = 0) {
        await this.clickHome();
        await Color.selectColorCombo(
            "#id-toolbar-btn-fontcolor",
            [squareCoord[0], squareCoord[1]],
            recY
        );
        await Tester.click(".footer.center > button");
    },

    selectFontColorByText: async function (R, G, B, grid) {
        await this.clickHome();
        await Color.selectColorComboByInput(
            "#id-toolbar-btn-fontcolor",
            R,
            G,
            B,
            grid
        );
        await Tester.click(".footer.center > button");
    },

    clickFontEyedrop: async function (x, y) {
        offsetX = x - 1;
        offsetY = y - 1;
        await this.clickHome();
        await Color.eyedropper("#id-toolbar-btn-fontcolor");
        await Tester.clickMouseInsideMain(offsetX, offsetY);
    },

    clickShadingEyedrop: async function (x, y) {
        offsetX = x - 1;
        offsetY = y - 1;
        await this.clickHome();
        await Color.eyedropper("#id-toolbar-btn-paracolor");
        await Tester.clickMouseInsideMain(offsetX, offsetY);
    },
};
