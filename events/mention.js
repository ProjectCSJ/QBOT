const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const logger = require('node-color-log');
const { Queue } = require('../modules/queue/queue');

module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		if (message.content === '<@948362856624189460>') {
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
			const guildObj = await queue.getGuild();
			if (guildObj.channel_id != message.channel.id) return await message.author.send(`Please ping bot in <#${guildObj.channel_id}>`);
			logger.info(`${message.author.tag} triggered event mention`);
			const result = await queue.addUser(message.author.id);
			if (result === 'error') return await message.author.send('U can\'t join the queue when U still in');
			const QueueStatus = new MessageEmbed()
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
			const QueueRowCount = await queue.getRowCount();
			if (QueueRowCount === 1) {
				const now = await queue.getFirst();
				const userObj = await message.guild.members.cache.get(now.user_id);
				try {
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
				catch (e) {
					QueueStatus
						.addFields(
							{
								name: 'Now Singing',
								value: 'U can only join when u are in the stage channel.',
							},
							{
								name: 'Queue list',
								value: '**Last One!**',
							},
						);
				}
			}
			else if (QueueRowCount > 1) {
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
			const threadObj = await queue.getGuild();
			const thread = message.channel.threads.cache.find((x) => x.id === threadObj.thread_id);
			// test: get()
			const QueueMessage = thread.messages.cache.find((x) => x.content === 'Queue Start!');
			await QueueMessage.edit({
				components: [QueueAction],
				content: 'Queue Start!',
				embeds: [QueueStatus],
			});
			return await message.author.send({
				content: 'I\'ll put U in the queue',
				ephemeral: false,
			});
		}
	},
};
