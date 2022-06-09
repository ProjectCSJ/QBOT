const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const logger = require('node-color-log');
const { Queue } = require('../queue/queue.js');

module.exports = {
	async execute(interaction, client) {
		const UserTag = interaction.user.tag;
		const UserIcon = interaction.user.avatarURL({ format: 'png', dynamic: true });
		const UserId = interaction.user.id;
		const UserUrl = `https://discord.com/users/${UserId}`;
		const target = interaction.message.embeds[0].description;
		const targetId = target.replace(/\D/g, '');
		const QueueGuildId = interaction.message.embeds[0].fields[0].value;
		const queue = new Queue(QueueGuildId);
		const QueueGuildData = await queue.getGuild();
		const QueueGuild = client.guilds.cache.find((x) => x.id === QueueGuildId);
		const QueueChannel = QueueGuild.channels.cache.get(QueueGuildData.channel_id);
		const QueueThread = QueueChannel.threads.cache.get(`${QueueGuildData.thread_id}`);
		const QueueMessage = QueueThread.messages.cache.find((x) => x.content === 'Queue Start!');
		await queue.swapUser(UserId, targetId);
		const QueueStatus = new MessageEmbed()
			.setAuthor({
				name: QueueGuild.me.displayName,
				iconURL: QueueGuild.members.me.avatarURL({ dynamic: true }),
				url: process.env.SiteURL,
			})
			.setColor('#00D1BD')
			.setDescription(`Here's queue in ${QueueGuild.name}!\nUsing button to control`)
			.setFooter({
				text: process.env.COPYRIGHT,
				iconURL: process.env.IconURL,
			})
			.setTitle('Queue');
		const QueueRowCount = await queue.getRowCount();
		if (QueueRowCount === 1) {
			const now = await queue.getFirst();
			const userObj = await message.guild.members.cache.get(now.user_id);
			await userObj.voice.setSuppressed(false);
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
				);
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
				);
		}
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
		const ReplyEmbed = new MessageEmbed()
			.setAuthor({
				name: UserTag,
				iconURL: UserIcon,
				url: UserUrl,
			})
			.setColor('#00D1BD')
			.setDescription('Okay～♪')
			.setFooter({
				text: process.env.COPYRIGHT,
				iconURL: QueueGuild.members.me.avatarURL({ dynamic: true }),
			})
			.setTitle('Swap Result');
		await QueueMessage.edit({
			components: [QueueAction],
			content: 'Queue Start!',
			embeds: [QueueStatus],
		});
		await interaction.deferUpdate();
		return client.users.cache.get(targetId).send({ embeds: [ReplyEmbed] });
	},
};
