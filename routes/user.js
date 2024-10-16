const express = require("express");
const user_router = express.Router();

const { login_controller, get_user_controller, register_controller } = require("../controller/user-controller")
user_router.post("/login", login_controller);
user_router.get("/get-user/:userId", get_user_controller);
user_router.post("/register", register_controller);

module.exports = {
    user_router
}