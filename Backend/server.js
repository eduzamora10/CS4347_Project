import mysql from 'mysql2'

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'soccer',
    database: '4347_db'
}).promise()

const result = await pool.query("SELECT * FROM Logins")
console.log(result)