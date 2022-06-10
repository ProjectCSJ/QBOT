const logger = require('node-color-log');
const { Queue } = require('../queue/queue.js');

module.exports = {
	async execute(interaction) {
		const queue = new Queue(interaction.guildId);
		const user = await queue.getUserById(interaction.user.id);
		const first = await queue.getFirst();
		logger.debug(user?.user_id);
		if (interaction.user.id !== user?.user_id) {
			await interaction.deferUpdate();
			return interaction.user.send('U can\'t do that!\nReason:```log\nU are not in the queue.```');
		}
		if (interaction.user.id === first.user_id) {
			await interaction.deferUpdate();
			return interaction.user.send('U can\'t do that!\nReason:```log\nNow is your turn.```');
		}
		await queue.delUser(interaction.user.id);
		const QueueStatus = new MessageEmbed()
			.setAuthor({
				name: interaction.guild.me.displayName,
				iconURL: interaction.guild.me.displayAvatarURL({ dynamic: true }),
				url: process.env.SiteURL,
			})
			.setColor('#00D1BD')
			.setDescription(`Here's queue in ${interaction.guild.name}!\nUsing button to control`)
			.setFooter({
				text: process.env.COPYRIGHT,
				iconURL: interaction.guild.me.displayAvatarURL({ dynamic: true }),
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
		return interaction.user.send('I already remove U from queue.');
	},
};
