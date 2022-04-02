/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable no-inline-comments */

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Queue } = require('/modules/queue/queue');

module.exports = {
	defaultPermission: true,
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Start queue.'),
	async execute(interaction) {
		// eslint-disable-next-line no-unused-vars
		const queue = new Queue(interaction.guild.id);
		await interaction.channel.threads.create({
			name: '[QBOT]Queue',
			autoArchiveDuration: 60,
			reason: `For queue in ${interaction.guild.name}`,
		});
		const thread = interaction.channel.threads.cache.find(x => x.name === '[QBOT]Queue');
		const QueueStatus = new MessageEmbed()
			.setColor('GREEN')
			.setAuthor({ name: process.env.AuthorName, iconURL: process.env.IconURL, url: process.env.SiteURL })
			.setTitle('Queue')
			.setDescription(`Here's queue in ${interaction.guild.name}\nUsing :fast_forward: react to call up next one\nUsing :heavy_minus_sign: to leave queue`)
			.addFields(
				{
					name: 'Now Singing',
					value:'**Wait to queue**',
				},
				{
					name: 'Queue list',
					value:'**Wait to queue**',
				},
			)
			.setFooter({ text: process.env.COPYRIGHT, iconURL: process.env.IconURL });
		const QueueAction = new MessageActionRow()
			.addComponents(
				new MessageButton({
					custom_id: 'next',
					label: 'Next one',
					style:'SUCCESS',
				}),
			)
			.addComponents(
				new MessageButton({
					custom_id: 'remove',
					label: 'Remove From Queue',
					style:'DANGER',
				}),
			);
		await thread.send({ content: 'Queue Start!', embeds: [QueueStatus], components: [QueueAction] });

		await interaction.reply({ content: 'Queue Start!' });
	},
};
