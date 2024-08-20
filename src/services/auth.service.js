
exports.findUser = async (query) => UserModel.findOne(query).lean();
