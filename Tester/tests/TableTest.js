const Table = require("../lib/Table");
Tester.createFile("Document");
Table.createTable(2, 2);
Table.setTableSettings([
    { type: 0, top: 5, left: 4, right: 8, bottom: 3, width: 3, spacing: 8 },
    { type: 1, width: 4 },
    { type: 2, size: 1.5, color: { type: 2, index: 5, subIndex: 3 }, backColor:{ type: 2, index: 5, subIndex: 3 }},
    { type: 3, aligment: "left" },
    { type: 4, title: "test", description: "test" },
]);
Tester.close();