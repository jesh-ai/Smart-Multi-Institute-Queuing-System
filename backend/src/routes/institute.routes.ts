import express from "express";
import {
  getInstituteInfo,
  getServices,
  getFormByServiceId,
  getPrivacyNotice
} from "../controllers/institute.controller.js";

const route = express.Router();

route.get("/info", getInstituteInfo);
route.get("/services", getServices);
route.get("/form/:serviceid", getFormByServiceId);
route.get("/notice", getPrivacyNotice);

export default route;