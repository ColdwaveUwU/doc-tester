class ClickHomeMethods {
    constructor(tester) {
        this.tester = tester;
        this.initialize();
    }

    async initialize(frameName = "frameEditor") {
        const frame = await this.tester.findFrameByName(frameName);
        try {
            await this.tester.waitForFunction(
                () => {
                    frame.waitForSelector(".ribtab.canedit.active");
                    return frame;
                },
                { timeout: 5000 }
            );

            console.log("ClickHomeMethods started");
        } catch (error) {
            await this.tester.click('li a[data-title="Home"]');
        }
    }

    async clickBold() {
        await this.tester.click("#id-toolbar-btn-bold");
    }

    async clickItalic() {
        await this.tester.click("#id-toolbar-btn-italic");
    }

    async clickUnderline() {
        await this.tester.click("#id-toolbar-btn-underline");
    }

    async clickStrikeout() {
        await this.tester.click("#id-toolbar-btn-strikeout");
    }

    async clickSuperscript() {
        await this.tester.click("#id-toolbar-btn-superscript");
    }

    async clickSubscript() {
        await this.tester.click("#id-toolbar-btn-subscript");
    }

    async clickIncFont() {
        await this.tester.click("#id-toolbar-btn-incfont");
    }

    async clickDecFont() {
        await this.tester.click("#id-toolbar-btn-decfont");
    }

    async clickFormControl() {
        await this.tester.click("#asc-gen439");
    }

    async setFontSize(size) {
        await this.tester.click("#asc-gen437");
        await this.tester.input(size);
    }

    async selectFontSize(size) {
        await this.tester.click("#asc-gen437 > button");
        await this.tester.selectByText(size, "#asc-gen437");
    }

    async clickHightlight(color) {
        await this.tester.click("#id-toolbar-btn-highlight > .btn.btn-toolbar");
        await this.tester.selectDrowdown("#id-toolbar-btn-highlight");
        await this.tester.selectColor("#id-toolbar-btn-highlight", color);
    }

    async clickChangeCase(textCase) {
        await this.tester.click("#id-toolbar-btn-case");
        await this.tester.selectByText(textCase, "#id-toolbar-btn-case");
    }

    async clickFontColor(color) {
        await this.tester.click("#id-toolbar-btn-fontcolor > .btn.btn-toolbar");
        await this.tester.selectDrowdown("#id-toolbar-btn-fontcolor");
        await this.tester.selectColor("#id-toolbar-btn-fontcolor", color);
    }
}

module.exports = ClickHomeMethods;
