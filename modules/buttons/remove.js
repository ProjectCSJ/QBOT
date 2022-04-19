const logger = require('node-color-log');
const { Queue } = require('../queue/queue.js');

module.exports = {
	async execute(interaction) {
		const queue = new Queue(interaction.guildId);
		const user = await queue.getUserById(interaction.user.id);
		logger.debug(user?.user_id);
		if (interaction.user.id !== user?.user_id) return interaction.user.send('U can\'t do that!\nReason: U are not in the queue.');
		await queue.delUser(interaction.user.id);
		await interaction.deferUpdate();
		return interaction.user.send('I already remove U from queue.');
	},
};
