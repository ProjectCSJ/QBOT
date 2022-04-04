/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable no-inline-comments */

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	defaultPermission: true,
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop queue.'),
	async execute(interaction) {
		const thread = interaction.channel.threads.cache.find(x => x.name === '[QBOT]Queue');
		const queue = new MessageEmbed()
			.setColor('#FE0F80')
			.setAuthor({
				name: process.env.AuthorName,
				iconURL: process.env.IconURL,
				url: process.env.SiteURL,
			})
			.setTitle('Queue Ended')
			.setDescription(`Sorry!\nQueue in ${interaction.guild.name} already **ended**!`)
			.addFields(
				{
					name: 'Now Singing',
					value:'**Queue Ended!**',
				},
				{
					name: 'Queue list',
					value:'**Queue Ended!**',
				},
			)
			.setFooter({
				text: process.env.COPYRIGHT,
				iconURL: process.env.IconURL,
			});
		const message = thread.messages.cache.find(x => x.content === 'Queue Start!');
		await message.edit({
			content: 'Queue End!',
			embeds: [queue],
		});
		await thread.setArchived(true);
		// TODO: Leave Stage
		await interaction.reply({
			content: 'Queue Ended!',
		});
	},
};
