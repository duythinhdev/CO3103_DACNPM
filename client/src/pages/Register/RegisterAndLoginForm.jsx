import axios from "axios";
import { Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import { UserContext } from "../../context/user/UserContext.jsx";
import GoogleButton from "react-google-button";
import React, { useContext, useMemo, useState } from "react";

export default function RegisterAndLoginForm() {
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("/user/login");

  const {
    setUsername: setLoggedInUsername,
    setId,
    setIsLoadingLogin,
    isLoadingLogin,
  } = useContext(UserContext);

  const url = useMemo(
    () =>
      isLoginOrRegister === "/user/register" ? "/user/register" : "/user/login",
    [isLoginOrRegister],
  );

  function handleSubmits() {
    const params = {
      username: values?.userName,
      password: values?.password,
    };
    setIsLoadingLogin(true);
    axios?.post(url, params)
      .then((response) => {
        setLoggedInUsername(values?.userName);
        setId(response?.id);
      })
      .catch((error) => {
        console.log("error", error);
      }).finally(() => {
        setIsLoadingLogin(false);
      });
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: '',
      password: '',
    },
    validationSchema: Yup?.object()?.shape({
      userName: Yup?.string()?.required('User Name is required'),
      password: Yup?.string()?.required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        handleSubmits();
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });
  const { errors, touched, values, handleSubmit, getFieldProps, handleChange } =
    formik;

  const google = () => {
    window.open("http://localhost:7878/user/google", "_self");
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <FormikProvider value={formik}>
        <Form
          noValidate
          autoComplete="off"
          className="w-64 mx-auto mb-12"
          onSubmit={handleSubmit}
        >
          <input
            {...getFieldProps("userName")}
            name="userName"
            id="userName"
            type="text"
            placeholder="User Name"
            onChange={(event) => {
              handleChange(event);
            }}
            className="block w-full rounded-sm p-2 mb-2 border"
          />
          <div style={{ color: "red" }}>
            {touched?.userName && errors?.userName}
          </div>
          <input
            {...getFieldProps("password")}
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={(event) => {
              handleChange(event);
            }}
            className="block w-full rounded-sm p-2 mb-2 border"
          />
          <div style={{ color: "red" }}>
            {touched?.password && errors?.password}
          </div>
          {isLoadingLogin ? <CircularProgress size={7}/> : <button
            className="bg-blue-500 text-white w-full rounded-sm p-2 flex justify-center items-center gap-2"
            type="submit"
            disabled={isLoadingLogin}
        >
          {isLoginOrRegister === "/user/register" ? "register" : "login"}
        </button>
          }
        <div className="text-center mt-2">
          {isLoginOrRegister === "/user/register" && (
              <div>
                Already a member?
                <button
                    className="bg-blue-500 text-white rounded-sm p-1"
                  onClick={() => setIsLoginOrRegister("/user/login")}
                >
                  Login here
                </button>
              </div>
            )}
            {isLoginOrRegister === "/user/login" && (
              <div>
                Dont have an account?
                <button
                  className="ml-1"
                  onClick={() => setIsLoginOrRegister("/user/register")}
                >
                  Register
                  {isLoadingLogin && <CircularProgress />}
                </button>
              </div>
            )}
            <div className='mt-2'></div>
            <GoogleButton
              label="Login Google "
              className="ml-1"
              onClick={google}
            />
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
}
