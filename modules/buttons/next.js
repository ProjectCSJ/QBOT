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
		const userObj = await interaction.guild.members.cache.get(userId);
		await userObj.voice.setSuppressed(true);

		const QueueStatus = new MessageEmbed()
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
						name: 'Queue List',
						value: '**Wait to Queue**',
					},
				);
		}
		if (QueueRowCount === 1) {
			const now = await queue.getFirst();
			const nowUser = await interaction.guild.members.cache.get(now.user_id);
			try {
				await nowUser.voice.setSuppressed(false);
			}
			catch (e) {
				// todo: handle not in stage channel
			}
			QueueStatus
				.addFields(
					{
						name: 'Now Singing',
						value: `<@${now.user_id}>`,
					},
					{
						name: 'Queue List',
						value: '**Last One!**',
					},
				);
		}
		if (QueueRowCount > 1) {
			const now = await queue.getFirst();
			const nowUser = await interaction.guild.members.cache.get(now.user_id);
			try {
				await nowUser.voice.setSuppressed(false);
			}
			catch (e) {
				// todo: handle not in stage channel
			}
			let list = '';
			const QueueList = await queue.getUserQueue();
			QueueList.forEach((element) => {
				logger.debug(element);
				if (element.index !== 1) list += '<@' + element.user_id + '>\n';
			});
			QueueStatus
				.addFields(
					{
						name: 'Now Singing',
						value: `<@${now.user_id}>`,
					},
					{
						name: 'Queue List',
						value: list,
					},
				);
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
