const Table = require("../lib/Table")
Tester.createFile("Document")
Table.createTable(2,2);
Table.setTableSettings([{type: 0, top: 5, left: 4, right: 8, bottom: 3, width: 3, spacing: 8}])