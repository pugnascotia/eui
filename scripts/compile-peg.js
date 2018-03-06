const { execSync } = require('child_process');

execSync('pegjs src/services/query/grammar/default_syntax.pegjs')
