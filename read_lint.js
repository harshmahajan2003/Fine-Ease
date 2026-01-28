const fs = require('fs');
const content = fs.readFileSync('lint_raw.txt', 'utf8');
const lines = content.split('\n');
lines.forEach(line => {
    if (line.includes('error') || line.includes('warning') || line.includes(':')) {
        if (!line.includes('~~') && !line.includes('CategoryInfo') && !line.includes('Node.js')) {
            console.log(line);
        }
    }
});
