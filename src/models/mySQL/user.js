import { pool } from "../../db/mysqlConection.js";


export async function getAllUsers(){
    const [result]= await pool.query("SELECT * FROM user")
return result
}

export async function getUser(user){
    const [result]= await pool.query(`SELECT * FROM user WHERE id=?`,[req.params.id])
    return result
}

export async function login(email, password){
    const [user] = await pool.query("SELECT * FROM user WHERE email=? and pasword=?",[email, password])
    const [adress] = await pool.query("SELECT address.* FROM user_address JOIN address ON user_address.address_id = address.id WHERE user_address.user_id = ?;",[user[0].id])

return {}
}
export async  function register(userDTO) {
    const { nombre, email, mobile, password } = userDTO; 
return {}
}