module.exports = {
    filePath: "image",

    clickInsertImage: async function () {
        await Tester.click(['a[data-title="Insert"]', "#tlbtn-insertimage"]);
    },
    fromFile: async function (fileName) {
        await this.clickInsertImage();
        await Tester.uploadFile(fileName, this.filePath, "#asc-gen237");
    },

    fromUrl: async function (url) {
        await this.clickInsertImage();
        await Tester.click("#asc-gen239");
        await Tester.inputToForm(url, "#id-dlg-url");
        await Tester.click('button[result="ok"]');
    },

    fromStorage: async function () {
        await this.clickInsertImage();
        await Tester.click("#asc-gen241");
    },
};
