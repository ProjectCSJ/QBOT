const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Queue } = require('../../modules/queue/queue');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.addStringOption((option) =>
			option.setName('id')
				.setDescription('Stage Channel ID')
				.setRequired(true),
		)
		.setDefaultPermission(true)
		.setDescription('Start queue.')
		.setName('start'),
	async execute(interaction) {
		const message = thread.messages.cache.find(x => x.content === 'Queue Start!');
		if (message !== undefined) return await interaction.reply('Queue already started!\nPlease using that tread');
		// eslint-disable-next-line no-unused-vars
		const queue = new Queue(interaction.guild.id);
		await interaction.channel.threads.create({
			autoArchiveDuration: 60,
			name: process.env.QueueName,
			reason: `For queue in ${interaction.guild.name}`,
		});
		const thread = interaction.channel.threads.cache.find(x => x.name === process.env.QueueName);
		const QueueStatus = new MessageEmbed()
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
			.setAuthor({
				iconURL: process.env.IconURL,
				name: process.env.AuthorName,
				url: process.env.SiteURL,
			})
			.setColor('#00D1BD')
			.setDescription(`Here's queue in ${interaction.guild.name}\nUsing :fast_forward: react to call up next one\nUsing :heavy_minus_sign: to leave queue`)
			.setFooter({
				iconURL: process.env.IconURL,
				text: process.env.COPYRIGHT,
			})
			.setTitle('Queue');
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
		await thread.send({
			components: [QueueAction],
			content: 'Queue Start!',
			embeds: [QueueStatus],
		});

		await interaction.reply({
			content: 'Queue Start!',
		});
	},
};
