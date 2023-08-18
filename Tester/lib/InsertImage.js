module.exports = {
    filePath: "image",

    clickInsertImage: async function () {
        await Tester.click(['a[data-title="Insert"]', "#tlbtn-insertimage"]);
    },
    fromFile: async function (fileName) {
        await this.clickInsertImage();
        await Tester.uploadFile(
            fileName,
            this.filePath,
            "#tlbtn-insertimage li:nth-child(1)"
        );
    },

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
