import pg from 'pg'
import dotenv from 'dotenv'

const {Pool} = pg

dotenv.config()

const DBSERVER=process.env.DBSERVER
const DBUSER=process.env.DBUSER
const DBPWD=process.env.DBPWD
const DBHOST=process.env.DBHOST
const DBPORT=process.env.DBPORT
const DB=process.env.DB

const pool = new Pool({
    connectionString:`${DBSERVER}://${DBUSER}:${encodeURIComponent(DBPWD)}@${DBHOST}:${DBPORT}/${DB}`
})

export const query = (text, params) => pool.query(text, params);
export default pool;