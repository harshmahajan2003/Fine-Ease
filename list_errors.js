const fs = require('fs');
try {
    const rawData = fs.readFileSync('lint_final.json', 'utf8');
    const startIdx = rawData.indexOf('[');
    if (startIdx === -1) {
        throw new Error('No JSON array found in file');
    }
    const cleanData = rawData.substring(startIdx);
    const results = JSON.parse(cleanData);
    results.filter(r => r.errorCount > 0).forEach(r => {
        console.log(`FILE: ${r.filePath}`);
        r.messages.filter(m => m.severity === 2).forEach(m => {
            console.log(`  L${m.line}:C${m.column} [${m.ruleId}] ${m.message}`);
        });
    });
} catch (e) {
    console.error('Error:', e.message);
}
