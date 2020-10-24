import { Router } from "express";
// *added* import for home route
import Home from "./home";
const router = Router();
// *change here to address routes*
router.use("/", Home);
export default router;
