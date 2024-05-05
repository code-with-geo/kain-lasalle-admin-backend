import { VendorModel } from "../models/Vendors.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import EmailSender from "../helper/EmailSender.js";
import { VerificationTokenModel } from "../models/Tokens.js";

export const addVendor = async (req, res) => {
	try {
		const { storeID, name, email, password, phonenumber } = req.body;

		let vendor = await VendorModel.findOne({
			email,
		});
		if (vendor) {
			return res.json({
				responsecode: "402",
				message: "This email is already registered.",
			});
		}
		vendor = await new VendorModel({
			storeID,
			name,
			email,
			password,
			phonenumber,
		}).save();

		const token = await new VerificationTokenModel({
			userID: vendor._id,
			token: jwt.sign({ id: vendor._id }, process.env.SECRET_KEY),
		}).save();

		const emailURL = `https://kain-lasale-store-dev.vercel.app/${vendor._id}/verify/${token.token}`;
		await EmailSender(
			vendor.email,
			"Email Verification",
			`Hi there, \n You have set ${vendor.email} as your registered email. Please click the link to verify your email: ` +
				emailURL
		);
		return res.json({
			responsecode: "200",
			message: "Successfully registered.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const updateVendor = async (req, res) => {
	try {
		const { name, email, password, phonenumber } = req.body;

		let vendor = await VendorModel.findOne({ _id: req.params.vendorID });
		if (!vendor) {
			return res.json({
				responsecode: "402",
				message: "Vendor not found.",
			});
		}
		if (vendor.email != email) {
			let checker = await VendorModel.findOne({ email });
			if (checker) {
				return res.json({
					responsecode: "402",
					message: "Please enter different email.",
				});
			}
		}

		await VendorModel.updateOne(
			{ _id: req.params.vendorID },
			{ $set: { name, email, password, phonenumber } }
		);

		return res.json({
			responsecode: "200",
			message: "Vendor information successfully updated.",
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const getVendorByID = async (req, res) => {
	try {
		let vendor = await VendorModel.findOne({ _id: req.params.vendorID });

		if (!vendor) {
			return res.json({
				message: "Vendor not found.",
				responsecode: "402",
			});
		}

		res.json({
			responsecode: "200",
			vendor: vendor,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const getAllVendor = async (req, res) => {
	try {
		let vendors = await VendorModel.find({ storeID: req.params.storeID });

		return res.json({
			responsecode: "200",
			vendors: vendors,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};

export const verifyEmail = async (req, res) => {
	try {
		let vendorID = "";
		let vendor = await VendorModel.findOne({ _id: req.params.id });
		if (!vendor)
			return res.json({ responsecode: "402", message: "Invalid link." });

		let token = await VerificationTokenModel.findOne({
			userID: vendor._id,
			token: req.params.token,
		});

		if (!token)
			return res.json({ responsecode: "402", message: "Invalid link." });
		vendorID = vendor._id;
		vendor = await VendorModel.updateOne(
			{ _id: vendor._id },
			{ $set: { verified: true } }
		);

		await VerificationTokenModel.deleteMany({ userID: vendorID });

		res.json({ responsecode: "200", message: "Email successfully verified." });
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.send({ message: "Please contact technical support." });
	}
};
