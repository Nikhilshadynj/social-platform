var log4js = require('log4js');
var applicationLog = log4js.getLogger("application_logs");
var errorLog = log4js.getLogger("error_logs");
applicationLog.info('INFO');
errorLog.error('ERROR');

function systemErrorLogs(data) {
    return errorLog.error(data);
}

module.exports = {
    APPLICATION_LOG: applicationLog,
    ERROR_LOG: {
        error: systemErrorLogs
    }
};