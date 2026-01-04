import {drizzle} from "drizzle-orm/postgres-js"
import postgres from 'postgres'
import * as schema from "./db/schema";

async function main(){
    const client = postgres(process.env.DATABASE_URL!, {max: 1})
    const db = drizzle(client, {schema})
    return db
}
export const db = await main();

