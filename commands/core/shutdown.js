/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable no-inline-comments */

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shutdown')
		.setDefaultPermission(false)
		.setDescription('Shut the bot down.'),
	async execute(interaction) {
		const shutdown = new MessageEmbed()
			.setColor('#FE0F80')
			.setAuthor({
				name: process.env.AuthorName,
				iconURL: process.env.IconURL,
				url: process.env.SiteURL,
			})
			.setTitle('🛑 緊急停止装置動作')
			.setDescription(`<@${interaction.client.user.id}> already shutted down by <@${interaction.user.id}>!`)
			.setFooter({
				text: process.env.COPYRIGHT,
				iconURL: process.env.IconURL,
			});
		await interaction.reply({
			embeds: [shutdown],
			ephemeral: false,
		});
		process.exit(0);
	},
};
