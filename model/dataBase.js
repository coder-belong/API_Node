const mysql = require('mysql')

let { db_config } = require('../config/default')

const db = mysql.createConnection({
    host: db_config.host,
    user: db_config.user,
    password: db_config.password,
    database: db_config.database,
});

// 连接数据库
db.connect(err => err ? console.log(err) : console.log('数据库连接成功'))

// 解决MySQL长时间不操作断开连接问题
db.on('error', err => {
    if (err) {
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            db.connect();
        } else {
            console.error(err.stack || err);
        }
    }
})



// 基于Promise封装SQL语句查询
function sqlQuery(sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, res) => {
            if (err) {
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}


// let { timeFommater } = require('../tool/tool')
// let nowTime = timeFommater(Date.now())

// let sql = `insert into cargo_info(id, cargo_name, cargo_price, cargo_count, cargo_time) value(3, '张胜', 7, 8, '${nowTime}')`
// console.log(sql);

// sqlQuery(sql).then(res => console.log(res))
// .catch(err => console.log(err))

module.exports = {
    sqlQuery
} 