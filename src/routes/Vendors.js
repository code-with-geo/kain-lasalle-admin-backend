import express from "express";
import {
	addVendor,
	getAllVendor,
	getVendorByID,
	updateVendor,
	verifyEmail,
} from "../controllers/Vendors.js";

const router = express.Router();

router.post("/add", addVendor);
router.get("/get-by-id/:vendorID", getVendorByID);
router.post("/edit/:vendorID", updateVendor);
router.get("/:storeID", getAllVendor);
router.get("/:id/verify/:token", verifyEmail);

export { router as VendorsRouter };
