require('dotenv').config();
const discord = require('discord.js');
const client  = new discord.Client();
const fs = require('fs');
client.CMD = new discord.Collection();
const mysql = require('mysql');

const prefix = '.';

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'JewDrake'
});

con.connect((err) => {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected successfully!');
})

fs.readdir('./cmd/', (err, js) => {
    if (err) return err;

    let js_files = js.filter(f => f.split('.').pop() === 'js');
    
    if (js_files.length < 1) {
        console.log('Script directory is empty...');
        return;
    }

    console.log(`Loading ${js_files.length} scripts.`);
    js_files.forEach((file, i) => {
        let props = require(`./cmd/${file}`);
        client.CMD.set(props.name, props);
        console.log(`Loaded ${file} ...`);
    });
});


client.on('ready', () => {
    console.log(`${client.user.tag}`)
})

client.on('message', (message) => {
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const CMD_USER = args.shift();
        const CMD_TEXT = args.join(' ');

        if (!client.CMD.has(command)) return;
        
        client.CMD.get(command).execute(message, client, CMD_USER, CMD_TEXT, con);
       }
})

client.login(process.env.BOT_TOKEN);