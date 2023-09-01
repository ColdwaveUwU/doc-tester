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
        await Tester.click("#table-advanced-link");
        for (const tableOption of tableOptions) {
            switch (tableOption.type) {
                case this.Type.Table:
                    const tableOptions = [
                        "top",
                        "left",
                        "right",
                        "bottom",
                        "width",
                        "spacing",
                    ];
                    await Tester.click(
                        'button[content-target="id-adv-table-width"]'
                    );
                    for (const prop of tableOptions) {
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
                    await Tester.click(okButton);
                    break;
                default:
                    console.log("Unknown Object");
            }
        }
    },
};
