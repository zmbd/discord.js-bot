module.exports = {
    name: 'ispeti',
    execute(message, client, CMD_USER, CMD_TEXT, mysql) {
        const role = message.member.roles.cache.some(roles => roles.name === 'admin');
        if (!role) {
            console.log('only admin can use this command!');
            message.channel.send(`${CMD_USER} tu ne adminas asile`);
        }
        
        if (CMD_TEXT.length < 5 || !message.mentions.members.first()) {
            message.channel.send(`Komandos naudojimas: .ispeti [ @User ]   [ PRIEZASTIS ]`)
            return;
        }

        message.delete({timeout: 1500});

        mysql.query('SELECT * FROM userinfo WHERE id = ?', [CMD_USER], (err, rows) => {
            if (err) throw err;
            
            let sql;
            if (rows.length < 1) {
                sql = "INSERT INTO userinfo (id, warningCount) VALUES ('"+CMD_USER+"', '"+1+"')";
            }
            else {
                sql = "UPDATE userinfo SET warningCount = warningCount + 1 WHERE id = '"+CMD_USER+"'";
            }
            mysql.query(sql);
            
            const channel = client.channels.cache.find(channel => channel.name === 'ispejimai')
            channel.send(`${CMD_USER} buvo ispetas\nturi ispejimu: ${rows[0].warningCount}\nispejimo priezastis: ${CMD_TEXT} \nispejo: <@${message.member.id}>`); 
        });

                
    }
};
