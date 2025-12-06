const User = require("./user.model");

class UserRepository {
    async findByPhone(phone) {
        return User.findOne({phone}).lean();
    }

    async getNextUserId() {
        const last = await User.findOne().sort({user_id: -1}).lean();
        return (last?.user_id || 0) + 1;
    }

    async create(data) {
        const doc = await User.create(data);
        return doc.toObject();
    }
}

module.export = new UserRepository();