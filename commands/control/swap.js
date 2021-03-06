const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Queue } = require('../../modules/queue/queue');

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
		const queue = new Queue(interaction.guild.id);
		const FirstOne = await queue.getFirst();
		const duration = 5;
		const user = interaction.options.getUser('target');
		const QueueList = await queue.getUserQueue();
		let check = 0;
		QueueList.forEach((element) => {
			if (element.user_id === interaction.user.id) check = 1;
		})
		if (check === 0) return interaction.reply({ content: `Sorry, but U are not in the queue` });
		if (user.id === interaction.user.id) return interaction.reply({ content: 'U can\'t swap with yourself', ephemeral: true });
		if (user.id === FirstOne.user_id) return interaction.reply({ content: 'Sorry, but U can\'t swap with someone who is singing.', ephemeral: true });
		let checker = 0;
		QueueList.forEach((element) => {
			if (element.user_id === user.id) checker = 1;
		});
		if (checker === 0) return interaction.reply({ content: 'U can\'t swap with someone didn\'t in queue.', ephemeral: true });
		const SwapEmbed = new MessageEmbed()
			.addFields(
				{
					name: 'GID',
					value: interaction.guildId,
				},
			)
			.setAuthor({
				iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
				name: interaction.user.tag,
				url: `https://discord.com/users/${interaction.user.id}`,
			})
			.setColor('#49E0F4')
			.setDescription(`<@${interaction.user.id}> wanna swap with U`)
			.setFooter({
				iconURL: interaction.guild.me.displayAvatarURL(),
				text: process.env.COPYRIGHT,
			})
			.setTitle('Swap');
		let SwapAction = new MessageActionRow()
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
		const userMsg = await user.send({
			components: [SwapAction],
			embeds: [SwapEmbed],
		});
		await interaction.reply({
			content: `I already ask <@${user.id}>`,
			ephemeral: true,
		});
		setTimeout(() => {
			SwapAction = new MessageActionRow()
				.addComponents(
					new MessageButton({
						custom_id: 'yes',
						label: 'Yes',
						style: 'SUCCESS',
						disabled: true,
					}),
				)
				.addComponents(
					new MessageButton({
						custom_id: 'no',
						label: 'No',
						style: 'DANGER',
						disabled: true,
					}),
				);
			userMsg.edit({
				components: [SwapAction],
				embeds: [SwapEmbed],
			});
		}, duration * 1000);
	},
};
