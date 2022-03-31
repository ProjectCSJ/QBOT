/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable no-inline-comments */

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	defaultPermission: true,
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop queue.'),
	async execute(interaction) {
		// const GID = interaction.guildId;
		// db.serialize((err) => {
		// 	if (err) return logger.log(err.message);
		// 	db.run(`CREATE TABLE IF NOT EXISTS ${GID} (Queue INTEGER,UID TEXT)`);
		// 	logger.info('DataBase create!');
		// });
		// db.close();
		const thread = interaction.channel.threads.cache.find(x => x.name === '[QBOT]Queue');
		const queue = new MessageEmbed()
			.setColor('RED')
			.setAuthor({ name: process.env.AuthorName, iconURL: process.env.IconURL, url: process.env.SiteURL })
			.setTitle('Queue Ended')
			.setDescription(`Sorry!\nQueue in ${interaction.guild.name} already **ended**!`)
			.addFields(
				{
					name: 'Now Singing',
					value:'**Queue Ended!**',
				},
				{
					name: 'Queue list',
					value:'**Queue Ended!**',
				},
			)
			.setFooter({ text: process.env.COPYRIGHT, iconURL: process.env.IconURL });
		const message = thread.messages.cache.find(x => x.content === 'Queue Start!');
		await message.reactions.removeAll();
		await message.edit({ content: 'Queue Ended!', embeds: [queue] });
		await thread.setArchived(true);
		// TODO: Leave Stage
		await interaction.reply('Queue Ended!');
	},
};
