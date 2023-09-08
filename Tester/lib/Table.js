const Color = require("../lib/Color");
module.exports = {
    /**
     * @typedef {Object} Color
     * @property {number} index
     * @property {number} type
     * @property {number | undefined} subIndex
     * @property {number | undefined} r
     * @property {number | undefined} g
     * @property {number | undefined} b
     * @property {number | undefined} hex
     * @property {number | undefined} x
     * @property {number | undefined} y
     * @property {number | undefined} hue
     */
    /**
     * @typedef {Object} TableOptions
     * @property {Color | undefined} color
     * @property {number} type
     * @property {number | undefined} top
     * @property {number | undefined} left
     * @property {number | undefined} right
     * @property {number | undefined} bottom
     * @property {number | undefined} width
     * @property {number | undefined} spacing
     * @property {number | undefined} size
     * @property {string | undefined} aligment
     * @property {string | undefined} title
     * @property {description | undefined} description
     */
    Type: {
        Table: 0,
        Cell: 1,
        Borders: 2,
        TextWrapping: 3,
        AlternativeText: 4,
    },
    insertButtonSelector: "#tlbtn-inserttable",
    clickTable: async function () {
        await Tester.click(['a[data-title="Insert"]', "#tlbtn-inserttable"]);
    },
    /**
     * @param {number | string} column
     * @param {number | string} rows
     */
    createTable: async function (column, rows) {
        const inputSelectors = [
            "#window-insert-table .input-row:nth-child(1) .form-control",
            "#window-insert-table .input-row:nth-child(2) .form-control",
        ];
        const inputValues = [column, rows];
        const okButton = 'button[result="ok"]';
        await this.clickTable();
        await Tester.selectByText(
            "Insert custom table",
            `${this.insertButtonSelector} a[type="menuitem"]`
        );
        for (let i = 0; i < inputSelectors.length; i++) {
            await Tester.inputToForm(inputValues[i], inputSelectors[i]);
        }
        await Tester.click(okButton);
    },
    /**
     * @param {TableOptions} tableOptions
     */
    setTableSettings: async function (tableOptions) {
        const okButton = 'button[result="ok"]';

        for (const tableOption of tableOptions) {
            switch (tableOption.type) {
                case this.Type.Table:
                    await this.setTableProperties(tableOption);
                    break;
                case this.Type.Cell:
                    await this.setCellProperties(tableOption);
                    break;
                case this.Type.Borders:
                    await this.setBorderProperties(tableOption);
                    break;
                case this.Type.TextWrapping:
                    await this.setTextWrappingProperties(tableOption);
                    break;
                case this.Type.AlternativeText:
                    await this.setAlternativeTextProperties(tableOption);
                    break;
                default:
                    console.log("Unknown Object");
                    break;
            }
        }

        await Tester.click(okButton);
    },
    /**
     * @param {TableOptions} tableOption
     */
    setTableProperties: async function (tableOption) {
        const props = ["top", "left", "right", "bottom", "width", "spacing"];
        await Tester.click("#table-advanced-link");

        for (const prop of props) {
            if (tableOption.hasOwnProperty(prop)) {
                if (prop === "width" || prop === "spacing") {
                    await Tester.click(`#tableadv-checkbox-${prop} label`);
                    await Tester.inputToForm(
                        tableOption[prop],
                        `#tableadv-number-${prop} .form-control`
                    );
                } else if (
                    prop === "top" ||
                    prop === "left" ||
                    prop === "right" ||
                    prop === "bottom"
                ) {
                    await Tester.inputToForm(
                        tableOption[prop],
                        `#tableadv-number-margin-table-${prop} .form-control`
                    );
                }
            }
        }
    },
    /**
     * @param {TableOptions} tableOption
     */
    setCellProperties: async function (tableOption) {
        const props = ["top", "left", "right", "bottom", "width", "wrap"];
        await Tester.click('button[content-target="id-adv-table-cell-props"]');
        for (const prop of props) {
            if (tableOption.hasOwnProperty(prop)) {
                if (prop === "width") {
                    await Tester.inputToForm(
                        tableOption[prop],
                        `#tableadv-number-pref${prop} .form-control`
                    );
                } else if (
                    prop === "top" ||
                    prop === "left" ||
                    prop === "right" ||
                    prop === "bottom"
                ) {
                    await Tester.click("#tableadv-checkbox-margins label");
                    await Tester.inputToForm(
                        tableOption[prop],
                        `#tableadv-number-margin-table-${prop} .form-control`
                    );
                } else if (prop === "wrap") {
                    await Tester.click("#tableadv-checkbox-wrap label");
                }
            }
        }
    },
    /**
     * @param {TableOptions} tableOption
     */
    setBorderProperties: async function (tableOption) {
        await Tester.click('button[content-target="id-adv-table-borders"]');
        if (tableOption.hasOwnProperty("size")) {
            await Tester.selectDropdown("#tableadv-combo-border-size");
            await Tester.click(
                `#tableadv-combo-border-size li[data-value="${tableOption["size"]}"]`
            );
        }

        if (tableOption.hasOwnProperty("color")) {
            await Color.selectColor(
                "#tableadv-border-color-btn",
                tableOption["color"]
            );
        }

        if (tableOption.hasOwnProperty("backColor")) {
            await Color.selectColor(
                "#tableadv-button-table-back-color",
                tableOption["backColor"]
            );
        }

        if (tableOption.hasOwnProperty("setBorder")) {
            await Tester.click(
                `#tableadv-button-border-${tableOption["setBorder"]}`
            );
        }
    },
    /**
     * @param {TableOptions} tableOption
     */
    setTextWrappingProperties: async function (tableOption) {
        await Tester.click('button[content-target="id-adv-table-wrap"]');
        if (tableOption.hasOwnProperty("wrapping")) {
            await Tester.click(
                `#tableadv-button-wrap-${tableOption["wrapping"]}`
            );
        }

        if (tableOption.hasOwnProperty("alignment")) {
            await Tester.click(
                `#tableadv-button-align-${tableOption["alignment"]}`
            );
        }

        if (tableOption.hasOwnProperty("indent")) {
            await Tester.inputToForm(
                tableOption["indent"],
                "#tableadv-number-indent .form-control"
            );
        }
    },
    /**
     * @param {TableOptions} tableOption
     */
    setAlternativeTextProperties: async function (tableOption) {
        await Tester.click('button[content-target="id-adv-table-alttext"]');
        if (tableOption.hasOwnProperty("title")) {
            await Tester.inputToForm(
                tableOption["title"],
                "#table-advanced-alt-title .form-control"
            );
        }

        if (tableOption.hasOwnProperty("description")) {
            await Tester.inputToForm(
                tableOption["description"],
                "#table-advanced-alt-description"
            );
        }
    },
};
