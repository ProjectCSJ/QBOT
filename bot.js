const logger = require('node-color-log');
logger.setDate(() => new Date().toLocaleString(undefined, {
	year: 'numeric',
	month: '2-digit',
	day: '2-digit',
	hour: '2-digit',
	hour12: false,
	minute: '2-digit',
	second: '2-digit',
}).replace(/\//g, '-'));
// logger.setLevel('info'); // comment when developement

const dotenv = require('dotenv');
dotenv.config();
const fs = require('node:fs');

const { Client, Collection, Intents } = require('discord.js');

const client = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_VOICE_STATES,
	],
});

client.commands = new Collection();
client.buttons = new Collection();

const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.data.name, command);
	}
}

const buttonFiles = fs.readdirSync('./modules/buttons/').filter((file) => file.endsWith('.js'));
for (const file of buttonFiles) {
	const button = require(`./modules/buttons/${file}`);
	client.buttons.set(file, button);
}

const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		logger.warn(`${error}`);
		await interaction.reply({ content: `Command Error!\nSend the error message screenshot to <@826327097945489408>\nError:\n\`\`\`log\n${error}\`\`\``, ephemeral: true });
	}
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isButton()) return;
	// TODO: Make button interaction
	const button = client.buttons.get(interaction.customId + '.js');
	await button.execute(interaction, client);
});

client.login(process.env.TOKEN);
