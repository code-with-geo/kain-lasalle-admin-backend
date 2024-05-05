import mongoose from "mongoose";

const AdminSchema = mongoose.Schema({
	name: { type: String },
	username: { type: String, unique: true, require: true },
	password: { type: String },
	createAt: {
		type: Date,
		default: Date.now,
	},
});

AdminSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

AdminSchema.set("toJSON", {
	virtual: true,
});

export const AdminsModel = mongoose.model("admins", AdminSchema);
