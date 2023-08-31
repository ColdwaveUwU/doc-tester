const path = require("path");
module.exports = {
    filePath: "image",

    clickInsertImage: async function () {
        await Tester.click(['a[data-title="Insert"]', "#tlbtn-insertimage"]);
    },
    /**
     * @param {string} fileName
     */
    fromFile: async function (fileName) {
        const directoryPath = path.join(
            __dirname,
            "..",
            "common",
            this.filePath,
            fileName
        );
        await this.clickInsertImage();
        const [fileChooser] = await Promise.all([
            Tester.page.waitForFileChooser(),
            Tester.click(["#tlbtn-insertimage li:nth-child(1)"]),
        ]);
        await fileChooser.accept([directoryPath]);
    },
    /**
     * @param {string} url
     */
    fromUrl: async function (url) {
        await this.clickInsertImage();
        await Tester.click("#tlbtn-insertimage li:nth-child(2)");
        await Tester.inputToForm(url, "#id-dlg-url");
        await Tester.click('button[result="ok"]');
    },

    fromStorage: async function () {
        await this.clickInsertImage();
        await Tester.click("#tlbtn-insertimage li:nth-child(3)");
    },
};
