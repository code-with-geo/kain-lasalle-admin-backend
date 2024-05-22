import { OrdersModel } from "../models/Orders.js";
import dotenv from "dotenv";
dotenv.config();

export const getAllOrders = async (req, res) => {
	try {
		let orders = await OrdersModel.find({});

		if (!orders) {
			return res.send({
				responsecode: "402",
				message: "No orders found for this user",
			});
		}

		orders = await OrdersModel.aggregate([
			{
				$lookup: {
					from: "users",
					localField: "userID",
					foreignField: "_id",
					as: "user",
				},
			},
			{
				$lookup: {
					from: "stores",
					localField: "storeID",
					foreignField: "_id",
					as: "store",
				},
			},
		]);

		return res.json({
			responsecode: "200",
			orders: orders,
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send({
			responsecode: "500",
			message: "Please contact technical support.",
		});
	}
};
