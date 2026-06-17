function getTableHeaders() {
  var docId = '1IOPpgtydsZegD0RNP246c0Rq5asvdU6RJZ7MJ1c1KCs';
  var doc = DocumentApp.openById(docId);
  var body = doc.getBody();
  var tables = body.getTables();
  var out = [];
  
  tables.forEach((t, idx) => {
    if (t.getNumRows() > 0) {
      var row = t.getRow(0);
      var cells = [];
      for (var c=0; c<row.getNumCells(); c++) {
        cells.push(row.getCell(c).getText().replace(/\n/g, ' '));
      }
      out.push("Table " + idx + ": " + cells.join(" | "));
    }
  });
  
  return out.join("\n");
}
