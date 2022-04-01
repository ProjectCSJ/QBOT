const Sequelize = require('sequelize');
const { Op } = require('@sequelize/core');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

class Queue {
    constructor(guildId) {
        this.guildId = guildId;
        this.user = require('./user.js')(sequelize, Sequelize.DataTypes, guildId);
        this.user.sync();
        //this.user.sync({ force: true });
    }

    async addUser(userId) {
        let count = await this.getRowCount() + 1;
        //console.log(count);
        await this.user.create({
            user_id: userId,
            index: count
        });
    }

    async swapUser(userA, userB) {
        let a = await this.user.findOne({ where: { user_id: userA } });
        let b = await this.user.findOne({ where: { user_id: userB } });
        let indexA = b.index;
        let indexB = a.index;
        await this.user.update({ index: indexA }, { where: { user_id: a.user_id } });
        await this.user.update({ index: indexB }, { where: { user_id: b.user_id } });
    }

    async delUser(userId) {
        let target = await this.user.findOne({ where: { user_id: userId } });
        let lowerUserList = await this.user.findAll({ where: { index: { [Op.gt]: target.index } }, raw: true })
        await this.user.destroy({ where: { user_id: userId } });
        for(let u of lowerUserList) {
            await this.user.update({ index: u.index-1 }, { where: { user_id: u.user_id } });
        }
    }

    async getUserQueue() {
        const list = await this.user.findAll({
            attributes: ['user_id'],
            order:[['index', 'ASC']],
            raw: true
        });
        return list;
    }

    async getRowCount() {
        let count = await this.user.count();
        return count;
    }

    async getFirst() {
        let result = await this.user.findOne({ where: { index: 1 }, raw: true });
        return result
    }
}

module.exports.Queue = Queue;