module.exports = {
	name: 'messageCreate',
	once: false,
	async execute(message) {
		if (/<@!?948362856624189460>/.test(message.content)) {
			// if (rows.length < 1) /* Set current to Wait for queue and set queue list to Null */;
			// if (rows.length = 1) /* Set queue list to last one */;
			await message.author.send({ content: 'I\'ll put u on the queue' });
		}
	},
};
