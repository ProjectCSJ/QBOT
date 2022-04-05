const logger = require('node-color-log');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		client.user.setPresence({
			activities: [{
				name: 'Private Beta',
				type: 'PLAYING',
			}],
			status: 'idle',
		});

		logger.info(`⏳Trying to login system with ${client.user.tag}...`);
		logger.info('✔️Logged in success!');
		logger.info(`Logged in user:${client.user.tag}!`);
	},
};
