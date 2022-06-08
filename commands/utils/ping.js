const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	defaultPermission: true,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		console.log(interaction.guild.me.avatarURL())
		const ping = new MessageEmbed()
			.setColor('RANDOM')
			.setAuthor({
				name: interaction.guild.me.displayName,
				iconURL: `${interaction.guild.me.avatarURL()}`,
				url: process.env.SiteURL,
			})
			.setTitle('Pong!')
			.setDescription(`延遲${Math.abs(Date.now() - interaction.createdTimestamp)}ms.`)
			.setFooter({
				text: process.env.COPYRIGHT,
				iconURL: `${interaction.guild.me.avatarURL()}`,
			});
		await interaction.reply({
			embeds: [ping],
			ephemeral: false,
		});
	},
};
