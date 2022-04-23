const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const logger = require('node-color-log');
const { Queue } = require('../modules/queue/queue');

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		if (/<@!?948362856624189460>/.test(message.content)) {
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

			await message.delete();
			if (message.guild.me.voice.channel === null) return await message.author.send('No queue started.');
			const queue = new Queue(message.guildId);
			logger.info(`${message.author.tag} triggered event mention`);
			const result = await queue.addUser(message.author.id);
			const QueueStatus = new MessageEmbed();
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
					)
					.setAuthor({
						name: process.env.AuthorName,
						iconURL: process.env.IconURL,
						url: process.env.SiteURL,
					})
					.setColor('#00D1BD')
					.setDescription(`Here's queue in ${message.guild.name}!\nUsing button to control`)
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
					.setDescription(`Here's queue in ${message.guild.name}!\nUsing button to control`)
					.setFooter({
						text: process.env.COPYRIGHT,
						iconURL: process.env.IconURL,
					})
					.setTitle('Queue');
			}
			const threadObj = await queue.getGuild();
			const thread = message.channel.threads.cache.find((x) => x.id === threadObj.thread_id);
			const QueueMessage = thread.messages.cache.find((x) => x.content === 'Queue Start!');
			await QueueMessage.edit({
				components: [QueueAction],
				content: 'Queue Start!',
				embeds: [QueueStatus],
			});
			if (result === 'error') {
				return await message.author.send({
					content: 'U can\'t join the queue when U still in',
					ephemeral: false,
				});
			}
			return await message.author.send({
				content: 'I\'ll put U on the queue',
				ephemeral: false,
			});
		}
	},
};
