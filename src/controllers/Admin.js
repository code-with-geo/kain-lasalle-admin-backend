import { AdminsModel } from "../models/Admin.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const createAdmin = async (req, res) => {
	try {
		const { name, username, password } = req.body;
		let admin = await AdminsModel.findOne({ username });

		if (admin) {
			return res.json({
				responsecode: "402",
				message: "This username is already registered.",
			});
		}

		admin = await new AdminsModel({ name, username, password }).save();

		return res.json({
			responsecode: "200",
			message: "Admin successfully registered.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		let admin = await AdminsModel.findOne({ username });

		if (!admin) {
			return res.json({
				message: "This admin is not registered.",
				responsecode: "402",
			});
		}

		admin = await AdminsModel.findOne({ username, password });
		if (!admin) {
			return res.json({
				message: "Incorrect username or password. Please try again.",
				responsecode: "402",
			});
		}

		const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY);
		res.json({
			responsecode: "200",
			message: "Successfully Login!",
			token,
			adminID: admin._id,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { username, password } = req.body;

		const admin = await AdminsModel.findOne({ username });
		if (!admin)
			return res.json({
				responsecode: "402",
				message: "This admin is not registered.",
			});

		await AdminsModel.updateOne(
			{
				_id: admin._id,
			},
			{ $set: { password } }
		);

		res.json({
			responsecode: "200",
			message: "Password successfully reset.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const verifyToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		jwt.verify(authHeader, process.env.SECRET_KEY, (err) => {
			if (err) {
				return res.sendStatus(403);
			}
			next();
		});
	} else {
		res.sendStatus(401);
	}
};
