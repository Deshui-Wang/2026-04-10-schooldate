const fs = require('fs');
const path = '/Users/deshu/Downloads/zl-project/zl-ai-data-web/src/views/reporting-center/complete_98_tables.json';

try {
    const data = fs.readFileSync(path, 'utf8');
    const json = JSON.parse(data);
    if (json.tables) {
        json.tables.forEach(table => {
            console.log(`${table.tableNum}: ${table.tableName}`);
        });
    } else {
        console.log('No tables found in JSON.');
    }
} catch (err) {
    console.error('Error reading or parsing file:', err);
}
