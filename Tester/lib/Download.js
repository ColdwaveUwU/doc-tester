module.exports = {
    downloadDocx: async function() {
        await Tester.downloadFile('docx');
    },

    downloadPdf: async function() {
        await Tester.downloadFile('pdf');
    },

    downloadOdt: async function() {
        await Tester.downloadFile('odt');
    },

    downloadOform: async function() {
        await Tester.downloadFile('oform');
    },

    downloadDotx: async function() {
        await Tester.downloadFile('dotx');
    },

    downloadPdfa: async function() {
        await Tester.downloadFile('pdfa');
    },

    downloadOtt: async function() {
        await Tester.downloadFile('ott');
    },

    downloadRtf: async function() {
        await Tester.downloadFile('rtf');
    },

    downloadTxt: async function(txtEncoding) {
        await Tester.downloadFile('txt', txtEncoding);
    },

    downloadFb2: async function() {
        await Tester.downloadFile('fb2');
    },

    downloadEpub: async function() {
        await Tester.downloadFile('epub');
    },

    downloadHtml: async function() {
        await Tester.downloadFile('html');
    },

    downloadJpg: async function() {
        await Tester.downloadFile('jpg');
    },

    downloadPng: async function() {
        await Tester.downloadFile('png');
    },
}