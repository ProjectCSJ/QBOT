const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	defaultPermission: true,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const ping = new MessageEmbed()
			.setColor('RANDOM')
			.setAuthor({ name: '幽霊Ｓ', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://csj.yeyunstudio.com' })
			.setTitle('Pong!')
			.setDescription(`延遲${Math.abs(Date.now() - interaction.createdTimestamp)}ms.`)
			.setFooter({ text: 'Copyright © Project CSJ', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		await interaction.reply({ embeds: [ping] });
	},
};
