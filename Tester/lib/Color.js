module.exports = {
    Type: {
        Auto: 0,
        Theme: 1,
        Standard: 2,
        EyeDropper: 3,
        Custom: 4,
        CustomClick: 5,
    },
    /**
     * @param {string} selector
     * @param {object} color
     */
    selectColor: async function (selector, color) {
        let index = 0;
        await Tester.selectDrowdown(selector);
        switch (color.type) {
            case this.Type.Auto:
                await Tester.click(`${selector} li:nth-child(1)`);
                break;
            case this.Type.Theme:
                const subIndexRow = 10;
                index = color.index + subIndexRow * color.subIndex;
                await Tester.click(`${selector} a[idx="${index}"]`);
                break;
            case this.Type.Standard:
                const standartColor = 60;
                index = color.index + standartColor;
                await Tester.click(`${selector} a[idx="${index}"]`);
                break;
            case this.Type.EyeDropper:
                const x = color.x - 1;
                const y = color.y - 1;
                await Tester.click(`${selector} li:nth-last-child(2)`);
                await Tester.clickMouseInsideMain(x, y);
                break;
            case this.Type.Custom:
                const colorInputs = [
                    { id: "#extended-spin-r .form-control", value: color.r },
                    { id: "#extended-spin-g .form-control", value: color.g },
                    { id: "#extended-spin-b .form-control", value: color.b },
                    { id: "#extended-text-color", value: color.grid },
                ];
                await Tester.selectByText(
                    "More colors",
                    `${selector} a[type="menuitem"]`
                );
                for (const input of colorInputs) {
                    await Tester.click(input.id);
                    await Tester.inputToForm(input.value, `${input.id}`);
                }
                await Tester.click(".footer.center > button");
                break;
            case this.Type.CustomClick:
                const recCoordX = 0;
                const recCoordY = color.hight;
                const squareCoordX = color.square[0];
                const squareCoordY = color.square[1];
                await Tester.selectByText(
                    "More colors",
                    `${selector} a[type="menuitem"]`
                );
                await Tester.mouseClickInsideElement(
                    "#id-hsb-colorpicker .img-colorpicker",
                    squareCoordX,
                    squareCoordY
                );
                await Tester.mouseClickInsideElement(
                    "#id-hsb-colorpicker .cnt-root > .img-colorpicker",
                    recCoordX,
                    recCoordY
                );
                await Tester.click(".footer.center > button");
                break;

            default:
                await Tester.click(`${selector} a[idx="${color.index}"]`);
                break;
        }
    },
};
