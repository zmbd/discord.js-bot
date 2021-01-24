module.exports = {
    name: 'pervesti',
    execute(message, client, CMD_USER, CMD_PROP, mysql) {
        const int_arg = parseInt(CMD_PROP);
        if (!message.mentions.members.first() || !Number.isInteger(int_arg) || CMD_USER === '<@!'+message.member.id+'>') {
            message.channel.send(`Komandos naudojimas: .pervesti [ @User ]   [ KIEKIS ]`)
            return;
        }

        let transfer_to = mysql.query("SELECT * FROM userinfo WHERE id = ?", [CMD_USER], (err, rows, fields) => {
            if (err) throw err;

            let sql;
            if (rows.length < 1) {
                sql = "INSERT INTO userinfo (id, warningCount, gold) VALUES ('"+CMD_USER+"', '"+warningCounter+"', '"+20+"')";
            }
            else {
                sql = "UPDATE userinfo SET warningCount = warningCount + 1 WHERE id = '"+CMD_USER+"'";
            }
            /* mysql.query(sql); */
        });
        let transfer_from = mysql.query("SELECT * FROM userinfo WHERE id = ?", ['<@!'+message.member.id+'>'], (err, rows, fields) => {
            if (err) throw err;

            let sql;
            if (rows.length < 1) {
                sql = "INSERT INTO userinfo (id, warningCount, gold) VALUES ('"+CMD_USER+"', '"+warningCounter+"', '"+20+"')";
            }
            else {
                if (rows[0].gold < int_arg) {
                    message.channel.send(`Turi per mazai aukso :(`);
                    return;
                }
                else {
                    //update transferees gold
                }
            }
            /* mysql.query(sql); */
        });
        console.log(message.member.id)
    }
};
