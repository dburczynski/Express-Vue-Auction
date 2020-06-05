const mongoose = require("mongoose");
(async () => {
    try {
        await mongoose.connect('mongodb://vuejs:xdxd123@ds229918.mlab.com:29918/heroku_7jllzdhr', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();

const db = mongoose.connection;

db.on("open", () => {
    console.log("Połączono z MongoDB!");
});

db.on("error", console.error.bind(console, "Błąd połączenia z MongoDb: "));

module.exports = mongoose;
