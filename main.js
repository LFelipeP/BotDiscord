const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("bd.json");
const db = low(adapter);

var id;

client.on("ready", () => {

});

client.on("guildCreate", guild => {

    db.set(guild.id, []).write();

});

client.on("guildDelete", guild => {

});

client.on("message", async message => {

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    if (message.content.startsWith("!")) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/g).shift().toLowerCase();

        if (args === "ping") {
            const m = await message.channel.send("Ping?");
            m.edit(`Pong! A latência é ${m.createdTimestamp - message.createdTimestamp}ms.`);
        }

        if (args === "registrar") {
            db.get("userlist")
                .push({
                    id: message.author.id,
                    nick: message.author.username,
                    avatar: message.author.displayAvatarURL(),
                    pontos: 0
                }).write();
            message.channel.send(`${message.author.username} registrado com sucesso!!`);
        }

        if (args === "addpergunta") {
            message.channel.send(`Qual a pergunta?`);
            author = message.author.id;
            client.on("message", async message => {
                if (message.author.id != author) {
                    return;
                }
                else 
                {
                    id = message.content.slice(0, 3);
                    reg = message.content.slice(config.prefix.length).trim().split(/ +/g).shift().toLowerCase();
                    db.get("perguntas")
                        .push({
                            id: id,
                            pergunta: reg,
                            resposta: ""
                        });
                    message.channel.send(`Qual a resposta?`);
                    return;
                }
            });
            client.on("message", async message => {
                if (message.author.id != author) {
                    return;
                }
                else {
                    await db.get("perguntas")
                            .find(id).assign({ resposta: message.content }).write();
                    message.channel.send(`${message.author.username} pergunta registrada com sucesso`);
                }
                return;
            });
            return;
        }
    }
});


client.login(config.token);