const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const logger = require('node-color-log');
const { Queue } = require('../queue/queue.js');

module.exports = {
	async execute(interaction) {
		const queue = new Queue(interaction.guildId);
		const user = await queue.getFirst();
		const userId = user?.user_id;
		logger.debug(userId);
		if (interaction.user.id !== userId) return interaction.user.send('U can\'t do that!\nReason: Not current user.');
		await queue.delUser(userId);

		const QueueStatus = new MessageEmbed();
		const QueueRowCount = await queue.getRowCount();

		const QueueAction = new MessageActionRow()
			.addComponents(
				new MessageButton({
					custom_id: 'next',
					label: 'Next one',
					style: 'SUCCESS',
				}),
			)
			.addComponents(
				new MessageButton({
					custom_id: 'remove',
					label: 'Remove From Queue',
					style: 'DANGER',
				}),
			);
		if (QueueRowCount < 1) {
			QueueStatus
				.addFields(
					{
						name: 'Now Singing',
						value: '**Wait to Queue**',
					},
					{
						name: 'Queue list',
						value: '**Wait to Queue**',
					},
				)
				.setAuthor({
					name: process.env.AuthorName,
					iconURL: process.env.IconURL,
					url: process.env.SiteURL,
				})
				.setColor('#00D1BD')
				.setDescription(`Here's queue in ${interaction.guild.name}!\nUsing button to control`)
				.setFooter({
					text: process.env.COPYRIGHT,
					iconURL: process.env.IconURL,
				})
				.setTitle('Queue');
		}
		if (QueueRowCount === 1) {
			const now = await queue.getFirst();
			QueueStatus
				.addFields(
					{
						name: 'Now Singing',
						value: `<@${now.user_id}>`,
					},
					{
						name: 'Queue list',
						value: '**Last One!**',
					},
				)
				.setAuthor({
					name: process.env.AuthorName,
					iconURL: process.env.IconURL,
					url: process.env.SiteURL,
				})
				.setColor('#00D1BD')
				.setDescription(`Here's queue in ${interaction.guild.name}!\nUsing button to control`)
				.setFooter({
					text: process.env.COPYRIGHT,
					iconURL: process.env.IconURL,
				})
				.setTitle('Queue');
		}
		if (QueueRowCount > 1) {
			const now = await queue.getFirst();
			let list = '';
			const QueueList = await queue.getUserQueue();
			QueueList.forEach((element) => {
				logger.debug(element);
				if (element.index !== 1) {
					list += '<@' + element.user_id + '>\n';
				}
			});
			QueueStatus
				.addFields(
					{
						name: 'Now Singing',
						value: `<@${now.user_id}>`,
					},
					{
						name: 'Queue list',
						value: list,
					},
				)
				.setAuthor({
					name: process.env.AuthorName,
					iconURL: process.env.IconURL,
					url: process.env.SiteURL,
				})
				.setColor('#00D1BD')
				.setDescription(`Here's queue in ${interaction.guild.name}!\nUsing button to control`)
				.setFooter({
					text: process.env.COPYRIGHT,
					iconURL: process.env.IconURL,
				})
				.setTitle('Queue');
		}

		const QueueMessage = interaction.channel.messages.cache.find((x) => x.content === ('Queue Start!'));
		await QueueMessage.edit({
			components: [QueueAction],
			content: 'Queue Start!',
			embeds: [QueueStatus],
		});
		await interaction.deferUpdate();
		return interaction.user.send('Thanks for your singing.');
	},
};
