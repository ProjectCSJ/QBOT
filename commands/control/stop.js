const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Queue } = require('../../modules/queue/queue');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDefaultPermission(true)
		.setDescription('Stop queue.'),
	async execute(interaction) {
		const queue = new Queue(interaction.guildId);
		await interaction.guild.me.voice.disconnect();
		// const threadname = process.env.QueueName;
		const result = await queue.getGuild();
		const thread = interaction.channel.threads.cache.find((x) => x.id === result.thread_id);
		const QueueStatus = new MessageEmbed()
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
				name: interaction.guild.members.me.displayName,
				iconURL: interaction.guild.members.me.avatarURL({ dynamic: true }),
				url: process.env.SiteURL,
			})
			.setColor('#FE0F80')
			.setDescription(`Sorry!\nQueue in ${interaction.guild.name} already **ended**!`)
			.setFooter({
				text: process.env.COPYRIGHT,
				iconURL: interaction.guild.members.me.avatarURL({ dynamic: true }),
			})
			.setTitle('Queue Ended');
		const message = thread.messages.cache.find((x) => x.content === ('Queue Start!'));
		await message.edit({
			content: 'Queue End!',
			embeds: [QueueStatus],
		});

		await queue.endQueue();

		await thread.setArchived(true);

		return await interaction.reply({
			content: 'Queue Ended!',
			ephemeral: false,
		});
	},
};
