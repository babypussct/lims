const fs = require('fs');
try {
    const code = fs.readFileSync('C:\\Users\\GCMS\\Documents\\GitHub\\lims\\gas\\Report_Type2_3A.gs', 'utf8');
    // Simple parse test by putting it in a function block and catching compile-time syntax errors
    new Function(code);
    console.log("Syntax is valid!");
} catch (e) {
    console.error("Syntax Error detected:", e.message);
}
