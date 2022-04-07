const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDefaultPermission(true)
		.setDescription('Stop queue.'),
	async execute(interaction) {
		const thread = interaction.channel.threads.cache.find((x) => x.name === process.env.QueueName);
		const queue = new MessageEmbed()
			.addFields(
				{
					name: 'Now Singing',
					value: '**Queue Ended!**',
				},
				{
					name: 'Queue list',
					value: '**Queue Ended!**',
				},
			)
			.setAuthor({
				name: process.env.AuthorName,
				iconURL: process.env.IconURL,
				url: process.env.SiteURL,
			})
			.setColor('#FE0F80')
			.setDescription(`Sorry!\nQueue in ${interaction.guild.name} already **ended**!`)
			.setFooter({
				text: process.env.COPYRIGHT,
				iconURL: process.env.IconURL,
			})
			.setTitle('Queue Ended');
		const message = thread.messages.cache.find((x) => x.content === 'Queue Start!');
		await message.edit({
			content: 'Queue End!',
			embeds: [queue],
		});
		await thread.setArchived(true);
		// TODO: Leave Stage
		await interaction.reply({
			content: 'Queue Ended!',
			ephemeral: false,
		});
	},
};
