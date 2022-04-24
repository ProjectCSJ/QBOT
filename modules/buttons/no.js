const { MessageEmbed } = require('discord.js');

module.exports = {
	async execute(interaction, client) {
		const UserTag = interaction.user.tag;
		const UserIcon = interaction.user.avatarURL({ format: 'png', dynamic: true });
		const UserId = interaction.user.id;
		const UserUrl = `https://discord.com/user/${UserId}`;
		const target = interaction.message.embeds[0].description;
		const targetId = target.replace(/\D/g, '');
		const ReplyEmbed = new MessageEmbed()
			.setAuthor({
				name: UserTag,
				iconURL: UserIcon,
				url: UserUrl,
			})
			.setColor('#FE0F80')
			.setDescription('Nope')
			.setFooter({
				text: process.env.COPYRIGHT,
				iconURL: process.env.IconURL,
			})
			.setTitle('Swap Result');
		await interaction.deferUpdate();
		return client.users.cache.get(targetId).send({ embeds: [ReplyEmbed] });
	},
};