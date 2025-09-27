import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../store/Auth";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [isLogin, setIsLogin] = useState(true);

  const validationSchema = Yup.object({
    userName: Yup.string().when([], {
      is: () => !isLogin,
      then: (schema) => schema.required("Enter your Name"),
      otherwise: (schema) => schema.notRequired(),
    }),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().when("isLogin", {
      is: false,
      then: (schema) =>
        schema
          .min(6, "At least 6 chars")
          .matches(/[A-Z]/, "1 uppercase")
          .matches(/[a-z]/, "1 lowercase")
          .matches(/[0-9]/, "1 number")
          .matches(/[^A-Za-z0-9]/, "1 special char")
          .required("Password required"),
      otherwise: (schema) => schema.required("Password required"),
    }),
    confirmPassword: !isLogin
      ? Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .required("Confirm Password is required")
      : Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isLogin,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const data = isLogin
          ? { email: values.email, password: values.password }
          : {
              userName: values.userName,
              email: values.email,
              password: values.password,
            };

        const res = await dispatch(
          isLogin ? loginUser(data) : registerUser(data)
        ).unwrap();
        {
          isLogin ? navigate("/user-list") : navigate("/");
        }
        toast.success(
          res.message || (isLogin ? "Login success" : "Register success")
        );

        if (!isLogin) setIsLogin(true);
      } catch (err) {
        toast.error(err?.message || "Something went wrong");
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <ToastContainer />
      <div
        className="card shadow p-4"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h2 className="text-center fw-bold mb-4">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form onSubmit={formik.handleSubmit}>
          {!isLogin && (
            <div className="form-group mb-3">
              <label>User Name</label>
              <input
                name="userName"
                className={`form-control ${
                  formik.touched.userName && formik.errors.userName
                    ? "is-invalid"
                    : ""
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.userName}
              />
              <div className="invalid-feedback">{formik.errors.userName}</div>
            </div>
          )}

          <div className="form-group mb-3">
            <label>Email</label>
            <input
              name="email"
              type="email"
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            <div className="invalid-feedback">{formik.errors.email}</div>
          </div>

          <div className="form-group mb-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className={`form-control ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <div className="invalid-feedback">{formik.errors.password}</div>
          </div>

          {!isLogin && (
            <div className="form-group mb-3">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                className={`form-control ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "is-invalid"
                    : ""
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              <div className="invalid-feedback">
                {formik.errors.confirmPassword}
              </div>
            </div>
          )}

          <button
            className={`btn w-100 ${isLogin ? "btn-success" : "btn-primary"}`}
            disabled={loading}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center mt-3 small">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default SignIn;
