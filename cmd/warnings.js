const ms = require('ms');

module.exports = {
    name: 'ispeti',
    execute(message, client, CMD_USER, CMD_TEXT, mysql) {
        const role = message.member.roles.cache.some(roles => roles.name === 'admin');
        if (!role) {
            console.log('only admin can use this command!');
            message.channel.send(`<@${message.member.id}>, norint naudoti sia komanda privaloma 'admin' role.`);
            return;
        }
        
        if (CMD_TEXT.length < 5 || !message.mentions.members.first()) {
            message.channel.send(`Komandos naudojimas: .ispeti [ @User ]   [ PRIEZASTIS ]`)
            return;
        }

        message.delete({timeout: 1500});


        let warningCounter = 1;
        mysql.query('SELECT * FROM userinfo WHERE id = ?', [CMD_USER], (err, rows) => {
            if (err) throw err;
            
            let sql;
            if (rows.length < 1) {
                sql = "INSERT INTO userinfo (id, warningCount, gold) VALUES ('"+CMD_USER+"', '"+warningCounter+"', '"+20+"')";
            }
            else {
                sql = "UPDATE userinfo SET warningCount = warningCount + 1 WHERE id = '"+CMD_USER+"'";
            }
            mysql.query(sql);
            
            
            if (rows[0] && rows[0].warningCount) warningCounter = rows[0].warningCount+1;


            console.log(warningCounter); 

            const channel = client.channels.cache.find(channel => channel.name === 'ispejimai')
            channel.send(`${CMD_USER} buvo ispetas\nturi ispejimu: ${warningCounter}/4\nispejimo priezastis: ${CMD_TEXT} \nispejo: <@${message.member.id}>`); 
        
            if (warningCounter > 3) {
                const target = message.mentions.users.first();
                const memberTarget = message.guild.members.cache.get(target.id);
                const muted = message.guild.roles.cache.find(role => role.name === 'muted');
                const unmute = message.guild.roles.cache.find(role => role.name === 'drake fan');
               
                console.log('uzmutink mane')
                memberTarget.roles.add(muted);
                memberTarget.roles.remove(unmute);
                setTimeout(async () => {
                    memberTarget.roles.remove(muted);
                    memberTarget.roles.add(muted);
                }, ms('600000')); 
            }
        });

                
    }
};
