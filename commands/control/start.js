/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable no-inline-comments */

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
// const logger = require('node-color-log');

// DataBase
// const sqlite3 = require('sqlite3').verbose();
// const dbfile = './data/data.db';
// const db = new sqlite3.Database(dbfile, sqlite3.OPEN_CREATE);

module.exports = {
	defaultPermission: true,
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Start queue.'),
	async execute(interaction) {
		// const GID = interaction.guildId;
		// db.serialize((err) => {
		// 	if (err) return logger.log(err.message);
		// 	db.run(`CREATE TABLE IF NOT EXISTS ${GID} (Queue INTEGER,UID TEXT)`);
		// 	logger.info('DataBase create!');
		// });
		// db.close();

		await interaction.channel.threads.create({
			name: '[QBOT]Queue',
			autoArchiveDuration: 60,
			reason: `For queue in ${interaction.guild.name}`,
		});
		const thread = interaction.channel.threads.cache.find(x => x.name === '[QBOT]Queue');
		const queue = new MessageEmbed()
			.setColor('GREEN')
			.setAuthor({ name: process.env.AuthorName, iconURL: process.env.IconURL, url: process.env.SiteURL })
			.setTitle('Queue')
			.setDescription(`Here's queue in ${interaction.guild.name}\nUsing :fast_forward: react to call up next one\nUsing :heavy_minus_sign: to leave queue`)
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
			.setFooter({ text: process.env.COPYRIGHT, iconURL: process.env.IconURL });
		await thread.send({ content: 'Queue Start!', embeds: [queue] });
		const reaction = thread.messages.cache.find(x => x.content === 'Queue Start!');
		await reaction.react('⏩');
		await reaction.react('➖');
		// TODO: Join Stage
		await interaction.reply({ content: 'Queue Start!' });
	},
};
