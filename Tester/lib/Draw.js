module.exports = {
    clickSelect: async function () {
        await Tester.click('li a[data-tab="draw"][data-title="Draw"]');
        await Tester.click("#slot-btn-draw-select");
    },
    /**
     * @param {string} color
     * @param {number} size
     * @param {number} startX
     * @param {number} startY
     * @param {number} endX
     * @param {number} endY
     */
    penOne: async function (color, size, startX, startY, endX, endY) {
        await Tester.drawFunction("pen_1", color, size);
        await Tester.mouseDrawingLine(
            "#id_main_view > #id_viewer",
            startX,
            startY,
            endX,
            endY
        );
    },
    /**
     * @param {string} color
     * @param {number} size
     * @param {number} startX
     * @param {number} startY
     * @param {number} endX
     * @param {number} endY
     */
    penTwo: async function (color, size, startX, startY, endX, endY) {
        await Tester.drawFunction("pen_2", color, size);
        await Tester.mouseDrawingLine(
            "#id_main_view > #id_viewer",
            startX,
            startY,
            endX,
            endY
        );
    },
    /**
     * @param {string} color
     * @param {number} size
     * @param {number} startX
     * @param {number} startY
     * @param {number} endX
     * @param {number} endY
     */
    highlighter: async function (color, size, startX, startY, endX, endY) {
        await Tester.drawFunction("highlighter", color, size);
        await Tester.mouseDrawingLine(
            "#id_main_view > #id_viewer",
            startX,
            startY,
            endX,
            endY
        );
    },
    /**
     * @param {number} startX
     * @param {number} startY
     * @param {number} endX
     * @param {number} endY
     */
    eraser: async function (startX, startY, endX, endY) {
        await Tester.click('li a[data-tab="draw"][data-title="Draw"]');
        await Tester.click("#slot-btn-draw-eraser");
        await Tester.mouseDrawingLine(
            "#id_main_view > #id_viewer",
            startX,
            startY,
            endX,
            endY
        );
    },
};
