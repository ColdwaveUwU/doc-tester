module.exports = {
    clickSelect: async function () {
        Tester.click("#asc-gen600");
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
        await this.clickSelect();
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
        await this.clickSelect();
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
        await this.clickSelect();
    },

    eraser: async function (startX, startY, endX, endY) {
        await Tester.click("#asc-gen598");
        await Tester.mouseDrawingLine(
            "#id_main_view > #id_viewer",
            startX,
            startY,
            endX,
            endY
        );
        await this.clickSelect();
    },
};
