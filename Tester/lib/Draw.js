const Color = require("../lib/Color");
module.exports = {
    clickDraw: async function () {
        await Tester.click('li a[data-tab="draw"][data-title="Draw"]');
    },

    clickSelect: async function () {
        await this.clickDraw();
        await Tester.click("#slot-btn-draw-select");
    },

    /**
     * 
     * @param {string} drawOption 
     * @param {object} color 
     * @param {string} size 
     */
    drawFunction: async function (drawOption, color, size = 1) {
        await this.clickDraw();
        const drawMethods = {
            pen_1: "#slot-btn-draw-pen-0",
            pen_2: "#slot-btn-draw-pen-1",
            highlighter: "#slot-btn-draw-pen-2",
        };
        const penSizeOption = ["0.25 mm", "0.5 mm", "1 mm", "2 mm", "3.5 mm"];
        switch (drawOption) {
            case "pen_1":
                await Color.selectColor(drawMethods.pen_1, color);
                break;
            case "pen_2":
                await Color.selectColor(drawMethods.pen_2, color);
                break;
            case "highlighter":
                await Color.selectColor(drawMethods.highlighter, color);
                break;
            default:
                throw new Error("Invalid draw option");
        }
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
        await this.clickDraw();
        await this.drawFunction("pen_1", color, size);
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
        await this.clickDraw();
        await this.drawFunction("pen_2", color, size);
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
        await this.clickDraw();
        await this.drawFunction("highlighter", color, size);
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
        await this.clickDraw();
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
