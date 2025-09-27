const express = require("express");
const userControl = require("../controller/userController");
const { verifyToken } = require("../auth/userAuth");
const router = express.Router();

router.post("/register", userControl.register);
router.post("/login", userControl.login);
router.post("/create-TaskData", verifyToken ,userControl.createTask);
router.post("/update-TaskData/:id", verifyToken ,userControl.updateTask);
router.post("/delete-TaskData/:id", verifyToken ,userControl.deleteTask);
router.get("/get-TaskData", verifyToken ,userControl.getTaskData);

module.exports = router;