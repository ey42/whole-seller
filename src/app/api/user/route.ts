import pool from "@/lib/db";

export async function GET(){
    try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM users;');
        client.release();
        return new Response (JSON.stringify(result.rows), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        
    }
}