/* eslint-disable no-unused-vars */
const logger = require('node-color-log');
const { Queue } = require('../modules/queue/queue');

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		if (/<@!?948362856624189460>/.test(message.content)) {
			const queue = new Queue(message.guild.id);
			await queue.addUser(message.author.id);
			// if (rows.length < 1) /* Set current to Wait for queue and set queue list to Null */;
			// if (rows.length = 1) /* Set queue list to last one */;
			logger.debug(`${message.author.tag} triggered event mention`);
			await message.author.send({
				content: 'I\'ll put u on the queue',
				ephemeral: false,
			});
		}
	},
};
