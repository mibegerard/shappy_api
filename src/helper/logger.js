const logger = require("pino");
const dayjs = require("dayjs");

const transport = logger.transport({
    target: 'pino-pretty',
    options: { colorize: true }
})

const log = logger({
    // level: env.LOG_LEVEL,
    timestamp: () => `,"time":" ${dayjs().format()}"`,
}, transport);

module.exports = log;