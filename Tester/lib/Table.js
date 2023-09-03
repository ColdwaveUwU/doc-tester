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

    /**
     * @param {Object} tableOptions
     */
    setTableSettings: async function (tableOptions) {
        const okButton = 'button[result="ok"]';
        await Tester.click("#table-advanced-link");
        const options = [
            "top",
            "left",
            "right",
            "bottom",
            "width",
            "spacing",
            "size",
            "color",
            "bcolor",
            "aligment",
            "wrapping",
            "indent",
            "aligment",
            "description",
            "title",
        ];
        for (const tableOption of tableOptions) {
            switch (tableOption.type) {
                case this.Type.Table:
                    await Tester.click(
                        'button[content-target="id-adv-table-width"]'
                    );
                    for (const prop of options) {
                        if (tableOption.hasOwnProperty(prop)) {
                            if (prop === "width" || prop === "spacing") {
                                await Tester.click(
                                    `#tableadv-checkbox-${prop} label`
                                );
                                await Tester.inputToForm(
                                    tableOption[prop],
                                    `#tableadv-number-${prop} .form-control`
                                );
                            } else {
                                await Tester.inputToForm(
                                    tableOption[prop],
                                    `#tableadv-number-margin-table-${prop} .form-control`
                                );
                            }
                        } else {
                            console.log("Unknown options");
                            break;
                        }
                    }
                    break;
                case this.Type.Cell:
                    await Tester.click(
                        'button[content-target="id-adv-table-cell-props"]'
                    );
                    for (const prop of options) {
                        if (tableOption.hasOwnProperty(prop)) {
                            await Tester.inputToForm(
                                tableOption[prop],
                                `#tableadv-number-pref${prop} .form-control`
                            );
                        }
                    }
                    break;
                case this.Type.Borders:
                    await Tester.click(
                        'button[content-target="id-adv-table-borders"]'
                    );
                    for (const prop of options) {
                        if (tableOption.hasOwnProperty(prop)) {
                            switch (prop) {
                                case "size":
                                    console.log(
                                        `li[data-value="${tableOption[prop]}"]`
                                    );
                                    await Tester.selectDrowdown(
                                        "#tableadv-combo-border-size"
                                    );
                                    await Tester.click(
                                        `#tableadv-combo-border-size li[data-value="${tableOption[prop]}"]`
                                    );
                                    break;
                                case "color":
                                    await Color.selectColor(
                                        "#tableadv-border-color-btn",
                                        tableOption[prop]
                                    );
                                    break;
                                case "bcolor":
                                    await Color.selectColor(
                                        "#tableadv-button-table-back-color",
                                        tableOption[prop]
                                    );
                                    break;
                                default:
                                    await Tester.click(
                                        `#tableadv-button-border-${tableOption[prop]}`
                                    );
                                    break;
                            }
                        }
                    }
                    break;
                case this.Type.TextWrapping:
                    await Tester.click(
                        'button[content-target="id-adv-table-wrap"]'
                    );
                    for (const prop of options) {
                        if (tableOption.hasOwnProperty(prop)) {
                            switch (prop) {
                                case "wrapping":
                                    await Tester.click(
                                        `#tableadv-button-wrap-${tableOption[prop]}`
                                    );
                                    break;
                                case "aligment":
                                    await Tester.click(
                                        `#tableadv-button-align-${tableOption[prop]}`
                                    );
                                    break;
                                case "indent":
                                    await Tester.inputToForm(
                                        tableOption[prop],
                                        "#tableadv-number-indent .form-control"
                                    );
                                    break;
                                default:
                                    console.log("Set Options");
                            }
                        }
                    }
                case this.Type.AlternativeText:
                    await Tester.click(
                        'button[content-target="id-adv-table-alttext"]'
                    );
                    for (const prop of options) {
                        if (tableOption.hasOwnProperty(prop)) {
                            switch (prop) {
                                case "title":
                                    await Tester.inputToForm(
                                        tableOption[prop],
                                        "#table-advanced-alt-title .form-control "
                                    );
                                    break;
                                case "description":
                                    await Tester.inputToForm(
                                        tableOption[prop],
                                        "#table-advanced-alt-description"
                                    );
                                    break;
                            }
                        }
                    }
                default:
                    console.log("Unknown Object");
            }
        }
        await Tester.click(okButton);
    },
};
