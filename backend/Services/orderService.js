import {query} from "../Config/database.js"

//C R U D

//Admind

export const getOrder = async()=>{
    const {rows} = await query("SELECT * FROM orders")
    return rows
}

//Admind
