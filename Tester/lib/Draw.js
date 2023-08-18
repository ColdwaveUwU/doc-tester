module.exports = {
    clickSelect: async function () {
        await Tester.click('li a[data-tab="draw"][data-title="Draw"]');
        await Tester.click("#slot-btn-draw-select");
    },

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
