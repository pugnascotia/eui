const { execSync } = require('child_process');

const useConsole = { stdio:[0,1,2] };

execSync('node ./scripts/compile-clean.js', useConsole);
execSync('node ./scripts/compile-peg.js', useConsole);
execSync('node ./scripts/compile-eui.js', useConsole);
execSync('node ./scripts/compile-scss.js', useConsole);
