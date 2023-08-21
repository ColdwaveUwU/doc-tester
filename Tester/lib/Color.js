module.exports = {
    Type : {
        Auto       : 0,
        Theme      : 1,
        Standard   : 2,
        EyeDropper : 3,
        Custom     : 4
    },
    
    openColorPanel: async function (selectorDropdown) {
        await Tester.selectDrowdown(selectorDropdown);
    },
    selectColorCombo: async function (
        selectorDropdown,
        squareCoord = [0, 0],
        recY
    ) {
        const selector = `${selectorDropdown} li:last-child`;
        await this.openColorPanel(selectorDropdown);
        await Tester.click(selector);
        await this.selectColorByRec(recY);
        await this.selectColorBySquare(squareCoord[0], squareCoord[1]);
    },

    selectColorComboByInput: async function (selectorDropdown, R, G, B, grid) {
        const selector = `${selectorDropdown} li:last-child`;
        await this.openColorPanel(selectorDropdown);
        const colorInputs = [
            { id: "#extended-spin-r .form-control", value: R },
            { id: "#extended-spin-g .form-control", value: G },
            { id: "#extended-spin-b .form-control", value: B },
            { id: "#extended-text-color", value: grid },
        ];

        await Tester.click(selector);

        for (const input of colorInputs) {
            await Tester.click(input.id);
            console.log(input);
            await Tester.inputToForm(input.value, `${input.id}`);
        }
    },

    selectColorBySquare: async function (x, y) {
        await Tester.mouseClickInsideElement(
            "#id-hsb-colorpicker .img-colorpicker",
            x,
            y
        );
    },

    selectColorByRec: async function (recY) {
        const midSelector = 6;
        await Tester.mouseClickInsideElement(
            "#id-hsb-colorpicker .cnt-root > .img-colorpicker",
            midSelector,
            recY
        );
    },

    colorHightlight: async function (selectorDropdown, color) {
        await this.openColorPanel(selectorDropdown);
        await Tester.selectColor("#id-toolbar-btn-highlight", color);
    },

    fontColor: async function (selectorDropdown, color) {
        await this.openColorPanel(selectorDropdown);
        await Tester.selectColor(selectorDropdown, color);
    },

    shadingColor: async function (selectorDropdown, color) {
        await this.openColorPanel(selectorDropdown);
        await Tester.selectColor("#id-toolbar-btn-paracolor", color);
    },

    eyedropper: async function (selectorDropdown) {
        const selector = `${selectorDropdown} li:nth-last-child(2)`;
        await this.openColorPanel(selectorDropdown);
        await Tester.click(selector);
    },
};
