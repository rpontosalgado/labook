import BaseDatabase from "./BaseDatabase";

class DatabaseSetup extends BaseDatabase {

	public async createTables():Promise<void> {
		try {
			await BaseDatabase.connection.raw(`
				CREATE TABLE labook_users(
					id VARCHAR(255) PRIMARY KEY,
					name VARCHAR(255) NOT NULL,
					email VARCHAR(255) UNIQUE NOT NULL,
					password VARCHAR(255) NOT NULL
				);
			`);

			await BaseDatabase.connection.raw(`
				CREATE TABLE labook_posts(
					id VARCHAR(255) PRIMARY KEY,
					photo VARCHAR(255) NOT NULL,
					description VARCHAR(255) NOT NULL,
					type ENUM("NORMAL","EVENT") DEFAULT "NORMAL",
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					author_id VARCHAR(255),
					FOREIGN KEY (author_id) REFERENCES labook_users (id)
				);
			`);

			await BaseDatabase.connection.raw(`
				CREATE TABLE labook_users_friends(
					user_one_id VARCHAR(255),
					user_two_id VARCHAR(255),
					FOREIGN KEY (user_one_id) REFERENCES labook_users (id),
					FOREIGN KEY (user_two_id) REFERENCES labook_users (id),
					PRIMARY KEY (user_one_id, user_two_id)
				);
			`);

			await BaseDatabase.connection.raw(`
				CREATE TABLE labook_posts_likes(
					post_id VARCHAR(255),
					user_id VARCHAR(255),
					FOREIGN KEY (post_id) REFERENCES labook_posts(id),
					FOREIGN KEY (user_id) REFERENCES labook_users(id),
					PRIMARY KEY (post_id, user_id)
				);
			`);

			await BaseDatabase.connection.raw(`
				CREATE TABLE labook_posts_comments(
					id VARCHAR(255) PRIMARY KEY,
					post_id VARCHAR(255),
					user_id VARCHAR(255),
					message TEXT NOT NULL,
					created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
					FOREIGN KEY (post_id) REFERENCES labook_posts(id),
					FOREIGN KEY (user_id) REFERENCES labook_users(id)
				);
			`);

			console.log("MySql setup completed!");
		} catch (error) {
			console.log(error);
		}
	}

	public async resetTables():Promise<void> {
		try {
			await BaseDatabase.connection.raw(`
				DROP TABLE labook_posts_comments;
			`);

			await BaseDatabase.connection.raw(`
				DROP TABLE labook_posts_likes;
			`);

			await BaseDatabase.connection.raw(`
				DROP TABLE labook_users_friends;
			`);

			await BaseDatabase.connection.raw(`
				DROP TABLE labook_posts;
			`);

			await BaseDatabase.connection.raw(`
				DROP TABLE labook_users;
			`);

			console.log("MySql tables dropped...");
			console.log("Recreating MySql tables ...");

			await this.createTables();

			console.log("MySql reset completed!");
		} catch (error) {
			console.log(error);
		}
	}

}

export default new DatabaseSetup();