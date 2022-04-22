module.exports = (sequelize, DataTypes) => {
	return sequelize.define('thread_table', {
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		thread_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		timestamps: false,
		freezeTableName: true,
	});
};
