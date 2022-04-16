const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Queue } = require('../../modules/queue/queue');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const logger = require('node-color-log');

module.exports = {
	data: new SlashCommandBuilder()
		.addChannelOption((option) =>
			option.setName('channel')
				.setDescription('Stage Channel ID')
				.setRequired(true),
		)
		.setDefaultPermission(true)
		.setDescription('Start queue.')
		.setName('start'),
	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		logger.debug(channel.type);
		if (channel.type !== 'GUILD_STAGE_VOICE') {
			return await interaction.reply({
				content: 'U should using a Stage channel',
				ephemeral: true,
			});
		}

		// eslint-disable-next-line no-unused-vars
		const connect = joinVoiceChannel({
			channelId: channel.id,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator,
		});

		logger.debug(interaction.guild.me.voice.channel);

		// eslint-disable-next-line no-unused-vars
		const queue = new Queue(interaction.guild.id);
		await interaction.channel.threads.create({
			autoArchiveDuration: 60,
			name: process.env.QueueName,
			reason: `For queue in ${interaction.guild.name}`,
		});
		const thread = interaction.channel.threads.cache.find((x) => x.name === process.env.QueueName);
		const QueueStatus = new MessageEmbed()
			.addFields(
				{
					name: 'Now Singing',
					value: '**Wait to queue**',
				},
				{
					name: 'Queue list',
					value: '**Wait to queue**',
				},
			)
			.setAuthor({
				iconURL: process.env.IconURL,
				name: process.env.AuthorName,
				url: process.env.SiteURL,
			})
			.setColor('#00D1BD')
			.setDescription(`Here's queue in ${interaction.guild.name}\nUsing :fast_forward: react to call up next one\nUsing :heavy_minus_sign: to leave queue`)
			.setFooter({
				iconURL: process.env.IconURL,
				text: process.env.COPYRIGHT,
			})
			.setTitle('Queue');
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
		await thread.send({
			components: [QueueAction],
			content: 'Queue Start!',
			embeds: [QueueStatus],
		});

		await interaction.reply({
			content: 'Queue Start!',
			ephemeral: false,
		});
	},
};
