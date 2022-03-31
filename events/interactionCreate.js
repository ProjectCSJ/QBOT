/* eslint-disable no-inline-comments */
/* eslint-disable max-len */
/* eslint-disable no-tabs */
const logger = require('node-color-log'); // Logger configuration

module.exports = {
	name: 'interactionCreate',
	once: false,
	execute(interaction) {
		if (!interaction.isCommand()) return; // Not command
		logger.info(`${interaction.user.tag} in #${interaction.channel.name} triggered ${interaction.commandName} command!`); // Post triggered commands to log
	},
};
