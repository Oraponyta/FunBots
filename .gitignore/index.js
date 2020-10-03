const Discord = require('discord.js');

const client = new Discord.Client();

const { token, Default_prefix } = require('./config.json');

const { readdirSync } = require('fs');

const { join } = require('path');

const config = require('./config.json');

humanizeDuration = require('humanize-duration'),
client.config = config;

const db = require('quick.db');



const { GiveawaysManager } = require('discord-giveaways');


client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

client.commands= new Discord.Collection();
//You can change the prefix if you like. It doesn't have to be ! or ;
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}


client.on("error", console.error);

client.on('ready', () => {
    console.log('Je suis en ligne et prêt pour surveiller les membres');
    client.user.setActivity(`FunBot faites d_frhelp`)
});


let stats = {
    serverID: '753318491896938528',
    total: "759057265839570984",
    member: "759057137338548265",
    bots: "759057018564378645"
}



client.on('guildMemberAdd', member => {
    if(member.guild.id !== stats.serverID) return;
    client.channels.cache.get(stats.total).setName(`Total Users: ${member.guild.memberCount}`);
    client.channels.cache.get(stats.member).setName(`Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    client.channels.cache.get(stats.bots).setName(`Bots: ${member.guild.members.cache.filter(m => m.user.bot).size}`);
   

        
})

client.on("guildCreate", gui => {
    let embed = new Discord.MessageEmbed()
          .setTitle("Un Serveur Viens De M'ajouter.")
          .addField('**__Nom Du Serveur__**', `${gui.name}`,)
          .addField('**__Créateur Du Serveur__**', `${gui.owner}`,)
          .addField('**__ID Du Serveur__**', `${gui.id}`,)
          .addField('**__Membres Présents Sur Le Serveur__**', `${gui.memberCount}`,)
          .setThumbnail(gui.iconURL({ dynamic: true }))
          .setFooter(`FunBot | Ajout`, client.user.displayAvatarURL())
          client.guilds.cache.get("760177767772848158").channels.cache.get("761241081949716500").send(embed)
});

client.on("guildDelete", gui => {
    let embed = new Discord.MessageEmbed()
          .setTitle("Un Serveur Viens De Me Supprimer.")
          .addField('**__Nom Du Serveur__**', `${gui.name}`,)
          .addField('**__Créateur Du Serveur__**', `${gui.owner}`,)
          .addField('**__ID Du Serveur__**', `${gui.id}`,)
          .addField('**__Membres Présents Sur Le Serveur__**', `${gui.memberCount}`,)
          .setThumbnail(gui.iconURL({ dynamic: true }))
          .setFooter(`FunBot | Supprimer`, client.user.displayAvatarURL())
          client.guilds.cache.get("760177767772848158").channels.cache.get("761241081949716500").send(embed)
});



client.on('guildMemberRemove', member => {
    if(member.guild.id !== stats.serverID) return;
    client.channels.cache.get(stats.total).setName(`Total Users: ${member.guild.memberCount}`);
    client.channels.cache.get(stats.member).setName(`Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    client.channels.cache.get(stats.bots).setName(`Bots: ${member.guild.members.cache.filter(m => m.user.bot).size}`);

    
})



client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    let prefix = await db.get(`prefix_${message.guild.id}`);
    if(prefix === null) prefix = Default_prefix;

    if(message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) return;


        try {
            client.commands.get(command).run(client, message, args);

        } catch (error){
            console.error(error);
        }
    }
})

client.login(token);
