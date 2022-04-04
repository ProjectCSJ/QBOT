const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shutdown')
		.setDefaultPermission(false)
		.setDescription('Shut the bot down.'),
	async execute(interaction) {
		const shutdown = new MessageEmbed()
			.setAuthor({
				name: process.env.AuthorName,
				iconURL: process.env.IconURL,
				url: process.env.SiteURL,
			})
			.setColor('#FE0F80')
			.setDescription(`<@${interaction.client.user.id}> already shutted down by <@${interaction.user.id}>!`)
			.setFooter({
				text: process.env.COPYRIGHT,
				iconURL: process.env.IconURL,
			})
			.setTitle('🛑 緊急停止装置動作');
		await interaction.reply({
			embeds: [shutdown],
			ephemeral: false,
		});
		process.exit(0);
	},
};
