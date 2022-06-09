const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Queue } = require('../../modules/queue/queue');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const logger = require('node-color-log');

module.exports = {
	data: new SlashCommandBuilder()
		.addChannelOption((option) =>
			option.setName('channel')
				.setDescription('Stage Channel')
				.setRequired(true),
		)
		.setDefaultPermission(true)
		.setDescription('Start queue.')
		.setName('start'),
	async execute(interaction) {
		if (interaction.guild.me.voice.channel !== null) {
			return await interaction.reply({ content: 'U can\'t start new queue!\nReason:```log\nA queue already started!```', ephemeral: true });
		}
		const channel = interaction.options.getChannel('channel');

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

		const date = new Date().toLocaleString(undefined, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			hour12: false,
			minute: '2-digit',
			timeZoneName: 'short',
		}).replace(/\:|\//g, '-');

		const threadname = process.env.QueueName + ' ' + date;
		logger.debug(threadname);
		await interaction.channel.threads.create({
			autoArchiveDuration: 60,
			name: threadname,
			reason: `For queue in ${interaction.guild.name}`,
		});

		await interaction.guild.me.voice.setSuppressed(false);

		// eslint-disable-next-line no-unused-vars
		const queue = new Queue(interaction.guild.id);

		const thread = interaction.channel.threads.cache.find((x) => x.name === threadname);
		const channelId = interaction.channel.id;
		logger.debug(thread.id);
		logger.debug(channelId);
		await queue.updateId(channelId, thread.id);
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
				iconURL: interaction.guild.members.me.avatarURL({ dynamic: true }),
				name: interaction.guild.me.displayName,
				url: process.env.SiteURL,
			})
			.setColor('#00D1BD')
			.setDescription(`Here's queue in ${interaction.guild.name}!\nUsing button to control`)
			.setFooter({
				iconURL: interaction.guild.members.me.avatarURL(),
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
			content: `Queue Start @ <#${channel.id}>!`,
			ephemeral: false,
		});
	},
};
