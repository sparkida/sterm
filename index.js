'use strict';
const chokidar = require('chokidar');
const startDir = process.cwd();
const path = require('path');
const fs = require('fs');
const winston = require('winston');
const consoleLogger = new winston.transports.Console({colorize: true});
const log = new winston.Logger({
    transports: [consoleLogger]
});
const format = require('util').format;
const exec = require('child_process').exec;
const watcher = chokidar.watch([
    '*.sql',
    path.join('**', '*.sql')
], {
    persistent: true
});

let config;
const userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
const runSQL = (filepath) => {
    let data;   
    log.debug('running sql');
    try {
        log.info('executing:', path.join(startDir, filepath));
        data = fs.statSync(path.join(startDir, filepath));
        log.debug('data:', data);
    } catch (fileError) {
        log.error(fileError);
        return;
    }
    data = data.toString();
    let execString = format(
        'psql -h %s -U %s -d %s -p %d -f %s -w',
        config.postgres.host,
        config.postgres.user,
        config.postgres.database,
        config.postgres.port || 5432,
        filepath
    ); 

    log.debug('execString:', execString);
    let q = exec(execString);
    q.stdout.on('data', console.log);
    q.stderr.on('data', log.warn);
};


let tmp = path.join(userHome, '.sterm');
let exists = fs.statSync(tmp);
if (!exists.isDirectory()) {
    fs.mkdirSync(tmp);
}
let sample = fs.readFileSync(path.join(__dirname, 'config.sample.js'));
fs.writeFileSync(path.join(tmp, 'config.sample.js'), sample);
config = require(path.join(tmp, 'config'));
watcher
    .on('ready', () => log.info('Watching...'))
    .on('change', runSQL);
