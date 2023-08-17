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

    clickFormControl: async function () {
        await this.clickHome();
        await Tester.click("#asc-gen439");
    },

    setFontSize: async function (size) {
        await this.clickHome();
        await Tester.click("#asc-gen437");
        await Tester.input(size);
    },

    selectFontSize: async function (size) {
        await this.clickHome();
        await Tester.click("#asc-gen437 > button");
        await Tester.selectByText(size, "#asc-gen437");
    },

    clickHightlight: async function (color) {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-highlight > .btn.btn-toolbar");
        await Tester.selectDrowdown("#id-toolbar-btn-highlight");
        await Tester.selectColor("#id-toolbar-btn-highlight", color);
    },

    clickChangeCase: async function (textCase) {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-case");
        await Tester.selectByText(textCase, "#id-toolbar-btn-case");
    },

    clickFontColor: async function (color) {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-fontcolor > .btn.btn-toolbar");
        await Tester.selectDrowdown("#id-toolbar-btn-fontcolor");
        await Tester.selectColor("#id-toolbar-btn-fontcolor", color);
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
        await Tester.click("#asc-gen439");
        await Tester.inputToForm(font, "#asc-gen439 > .form-control");
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
                await Tester.click("#asc-gen212");
                break;
            case "hidden":
                await Tester.click("#asc-gen214");
                break;
            case "all":
                await Tester.click("#asc-gen212");
                await Tester.selectDrowdown("#id-toolbar-btn-hidenchars");
                await Tester.click("#asc-gen214");
                break;
            default:
                console.log("Input select");
                break;
        }
    },

    selectShading: async function (color) {
        await this.clickHome();
        await Tester.selectDrowdown("#id-toolbar-btn-paracolor");
        await Tester.selectColor("#asc-gen578-color-menu", color);
    },

    clickClearStyle: async function () {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-clearstyle");
    },

    selectFontMoreBySquare: async function (x, y) {
        await this.clickHome();
        await Tester.click("#id-toolbar-btn-fontcolor > .btn.btn-toolbar");
        await Tester.selectDrowdown("#id-toolbar-btn-fontcolor");
        await Tester.click("#asc-gen566-color-new");
        await Tester.mouseClickInsideElement(
            "#id-hsb-colorpicker .img-colorpicker",
            x,
            y
        );
    },
};
