module.exports = (client, mysql) =>  {
    client.on('guildMemberAdd', (member) => {
        const newRole = member.guild.roles.cache.find(role => role.name === 'drake fan');
        member.roles.add(newRoled);
        console.log(member.id);
        mysql.query("INSERT INTO userinfo (id, warningCount, gold) VALUES ('<@!"+member.id+">', '"+0+"', '"+20+"')");
    });
};
