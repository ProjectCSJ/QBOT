module.exports = (sequelize, DataTypes, guildId) => {
    return sequelize.define(`queue_${guildId}`, {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        index: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: false,
        freezeTableName: true
    });
}