const logger = require('node-color-log');
const { Queue } = require('../queue/queue.js');

module.exports = {
	async execute(interaction) {
		const queue = new Queue(interaction.guildId);
		const user = await queue.getUserById(interaction.user.id);
		const first = await queue.getFirst();
		logger.debug(user?.user_id);
		if (interaction.user.id !== user?.user_id) return interaction.user.send('U can\'t do that!\nReason:```log\nU are not in the queue.```');
		if (interaction.user.id === first.user_id) return interaction.user.send('U can\'t do that!\nReason:```log\nNow is your turn.```');
		await queue.delUser(interaction.user.id);
		await interaction.deferUpdate();
		return interaction.user.send('I already remove U from queue.');
	},
};
