import knex from "knex";
import dotenv from "dotenv";

dotenv.config();

export default class BaseDatabase{

	protected static connection: knex = knex({
		client: "mysql",
		connection: {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			port: 3306,
			database: process.env.DB_NAME,
		}
	});

}