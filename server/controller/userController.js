const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userData = require("../model/user");
const taskData = require("../model/task");
const { signedToken } = require("../auth/userAuth");
const mongoose = require("mongoose");

class userControl {
  register = async (req, res) => {
    const data = req.body;
    try {
      const user = await userData.findOne({ email: data.email });
      if (user)
        return res.send({ status: false, message: "Email Aldready Exists.." });

      const encPass = await bcrypt.hash(data.password, 10);
      await userData
        .create({ ...data, password: encPass })
        .then((resp) =>
          res.send({ status: true, message: "Registration Successfull", resp })
        )
        .catch((error) =>
          res.send({ status: false, message: "Registration Failed", error })
        );
    } catch (error) {
      console.log("error--", error);
      res.send({ status: false, message: "Internal Error", error });
    }
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const users = await userData.findOne({ email: email });
      const decPass = await bcrypt.compare(password, users.password);

      if (!decPass)
        return res.send({ status: false, message: "Invalid Password..." });

      await signedToken({ id: users._id })
        .then((resp) =>
          res.send({
            status: true,
            message: "Login Successfull",
            token: resp,
          })
        )
        .catch((error) => {
          console.log("error--", error);
          res.send({ status: false, message: "Login Failed", error });
        });
    } catch (error) {
      console.log("error--", error);
      res.send({ status: false, message: "Internal Error", error });
    }
  };

  createTask = async (req, res) => {
    const id = res.locals.id;
    const data = req.body;
    try {
      if (!id) return res.send({ status: false, message: "Invalid User.." });
      const task = new taskData({
        userID: id,
        ...data,
      });
      await task
        .save()
        .then((resp) =>
          res.send({ status: true, message: "Task Added", data: resp })
        )
        .catch((error) =>
          res.send({ status: false, message: "Failed to Create Task", error })
        );
    } catch (error) {
      console.log("error--", error);
      res.send({ status: false, message: "Internal Error", error });
    }
  };

  updateTask = async (req, res) => {
    const id = res.locals.id;
    const data = req.body;
    try {
      if (!id) return res.send({ status: false, message: "Invalid User.." });

      const task = await taskData.findOne({ _id: req.params.id });
      if (!task)
        return res.send({ status: false, message: "Task Not Found.." });

      await taskData
        .findByIdAndUpdate(
          { _id: req.params.id },
          { $set: { ...data } },
          { new: true }
        )
        .then((resp) =>
          res.send({ status: true, message: "Task Data Updated", data: resp })
        )
        .catch((error) =>
          res.send({
            status: false,
            message: "Failed to Update the Task",
            error,
          })
        );
    } catch (error) {
      console.log("error--", error);
      res.send({ status: false, message: "Internal Error", error });
    }
  };

  deleteTask = async (req, res) => {
    const id = res.locals.id;
    try {
      if (!id) return res.send({ status: false, message: "Invalid User.." });

      const task = await taskData.findOne({ _id: req.params.id });
      if (!task)
        return res.send({ status: false, message: "Task Not Found.." });

      await taskData
        .findByIdAndDelete({ _id: req.params.id })
        .then((resp) =>
          res.send({ status: true, message: "Task Data Deleted", data: resp })
        )
        .catch((error) =>
          res.send({
            status: false,
            message: "Failed to Delete the Task",
            error,
          })
        );
    } catch (error) {
      console.log("error--", error);
      res.send({ status: false, message: "Internal Error", error });
    }
  };

  getTaskData = async (req, res) => {
    const id = res.locals.id;
    try {
      if (!id) return res.send({ status: false, message: "Invalid User.." });

      await taskData
        .find({ userID: id })
        .then((resp) =>
          res.send({ status: true, message: "Task Data", data: resp })
        )
        .catch((error) =>
          res.send({ status: false, message: "Failed to Get the Task", error })
        );
    } catch (error) {
      console.log("error--", error);
      res.send({ status: false, message: "Internal Error", error });
    }
  };
}

module.exports = new userControl();
