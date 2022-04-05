const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.addUserOption((option) =>
			option.setName('target')
				.setDescription('Who U wanna swap')
				.setRequired(true),
		)
		.setDefaultPermission(true)
		.setDescription('Swap with someone in queue.')
		.setName('swap'),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		const SwapEmbed = new MessageEmbed()
			.setAuthor({
				iconURL: interaction.user.avatarURL({ dynamic: true }),
				name: interaction.user.tag,
				url: `https://discord.com/users/${interaction.user.id}`,
			})
			.setColor('#49E0F4')
			.setDescription(`<@${interaction.user.id}> wanna swap with U`)
			.setFooter({
				iconURL: process.env.IconURL,
				text: process.env.COPYRIGHT,
			})
			.setTitle('Swap');
		const SwapAction = new MessageActionRow()
			.addComponents(
				new MessageButton({
					custom_id: 'yes',
					label: 'Yes',
					style: 'SUCCESS',
				}),
			)
			.addComponents(
				new MessageButton({
					custom_id: 'no',
					label: 'No',
					style: 'DANGER',
				}),
			);
		await user.send({
			components: [SwapAction],
			embeds: [SwapEmbed],
		});
		await interaction.reply({
			content: `I already ask <@${user.id}>`,
		});
	},
};
