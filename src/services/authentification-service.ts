import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.json';
import { ConnectError } from "../classes/connect-error";
import iconsList from "../lists/iconsList";
import db from '../db/pgpool';
import globalhelper from '../helpers/globals-helper.js';
let pool = db.getPool();

export class AuthentificationService {
	static async registerUser(username: string, password: string) {


		if (!username || !password) {
			globalhelper.setExpFalse();
			throw new ConnectError('INVALID_PARAMETERS');
		}
		let prep = "SELECT username FROM USERS WHERE username = $1";
		let dbres = await pool.query(prep, [username]);

		if (dbres.rows.length > 0) {
			globalhelper.setExpFalse();
			throw new ConnectError('USERNAME_ALREADY_EXISTS');
		}


		const saltRounds = 8;
		const hash = bcrypt.hashSync(password, saltRounds);

		const time = Date.now();

		const x = (Math.random() * 100) - 50;
		const y = (Math.random() * 100) - 50;
		const random = Math.floor(Math.random() * (iconsList.length - 1));
		const icon = iconsList[random];
		prep = "INSERT INTO USERS(username,password,lastupdate,creationtime,xcoord,ycoord,icon,seeds) VALUES($1,$2,$3,$4,$5,$6,$7,$8)";
		dbres = await pool.query(prep, [username, hash, time, Date.now(), x, y,icon,25]);

	};


	static async loginUser(username: string, password: string) {
		if (!username || !password) {
			globalhelper.setExpFalse();
			throw new ConnectError('INVALID_PARAMETERS');
		}

		let prep = "SELECT * FROM USERS WHERE username = $1";
		let user = (await pool.query(prep, [username])).rows[0];

		if (!user) {
			globalhelper.setExpFalse();
			throw new ConnectError('INVALID_CREDENTIALS');
		}

		const match = await bcrypt.compare(password, String(user.password));
		if (!match) {
			globalhelper.setExpFalse();
			throw new ConnectError('INVALID_CREDENTIALS');
		}

		const payload = {
			user: {
				id: user.id,
				username: user.username
			}
		};

		const token = jwt.sign(payload, config.jwtSecret, {
			expiresIn: '1d'
		});

		return token;
	};
}