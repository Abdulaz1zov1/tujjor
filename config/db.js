const mongoose = require("mongoose");

const url = "mongodb://127.0.0.1:27017/tujjor";
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log(`MongoDB connected : ${conn.connection.host}`);
	} catch (err) {
		console.log(err);
	}
};

module.exports = connectDB;
