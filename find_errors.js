const fs = require('fs');
const results = JSON.parse(fs.readFileSync('lint_results.json', 'utf8'));
results.filter(r => r.errorCount > 0).forEach(r => {
    console.log(r.filePath);
    r.messages.filter(m => m.severity === 2).forEach(m => {
        console.log(`  ${m.line}:${m.column} ${m.message} (${m.ruleId})`);
    });
});
