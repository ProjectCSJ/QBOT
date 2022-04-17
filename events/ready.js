const logger = require('node-color-log');
const { execSync } = require('child_process');
const fs = require('node:fs');
const { generateDependencyReport } = require('@discordjs/voice');
const date = new Date().toLocaleString(undefined, {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	hour12: false,
	minute: '2-digit',
	timeZoneName: 'short',
}).replace(/\:|\//g, '-');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		logger.debug(date);
		client.user.setPresence({
			activities: [{
				name: 'Private Beta',
				type: 'PLAYING',
			}],
			status: 'idle',
		});

		logger.info('Checking DB status');
		if (!fs.existsSync('database.sqlite')) {
			logger.debug('Can\'t find out DB file.');
			logger.debug('Creating...');
			execSync('npm run db');
			logger.debug('Create complete!');
		}
		logger.info('DB checked!');

		logger.debug('\n' + generateDependencyReport());
		logger.debug(`⏳Trying to login system with ${client.user.tag}...`);
		logger.debug('✔️Logged in success!');
		logger.info(`Logged in user:${client.user.tag}!`);
	},
};
