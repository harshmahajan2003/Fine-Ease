const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('lint_final.json');
    // It's a JSON file, so let's just use JSON.parse but first read it fully
    let content = fs.readFileSync('lint_final.json', 'utf8');
    const start = content.indexOf('[');
    if (start !== -1) {
        const results = JSON.parse(content.substring(start));
        results.forEach(val => {
            if (val.errorCount > 0) {
                console.log(`FILE: ${val.filePath}`);
                val.messages.forEach(msg => {
                    if (msg.severity === 2) {
                        console.log(`  L${msg.line}:C${msg.column} [${msg.ruleId}] ${msg.message}`);
                    }
                });
            }
        });
    } else {
        console.log("No JSON found");
    }
}

processLineByLine();
