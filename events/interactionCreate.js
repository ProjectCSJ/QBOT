const logger = require('node-color-log');

module.exports = {
	name: 'interactionCreate',
	once: false,
	execute(interaction) {
		if (interaction.isCommand()) return logger.debug(`${interaction.user.tag} in #${interaction.channel.name} triggered ${interaction.commandName} command!`);
		if (interaction.isButton()) return logger.debug(`${interaction.user.tag} triggered  button ${interaction.customId}`);
	},
};
