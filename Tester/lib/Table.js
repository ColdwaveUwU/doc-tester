const Color = require("../lib/Color");
module.exports = {
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
