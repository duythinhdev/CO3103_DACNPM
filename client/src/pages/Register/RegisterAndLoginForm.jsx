import {useContext, useState} from "react";
import axios from "axios";
import {Form, FormikProvider, useFormik} from 'formik';
import * as Yup from "yup";
import {UserContext} from "../../context/user/UserContext.jsx";
import GoogleButton from 'react-google-button';

export default function RegisterAndLoginForm() {
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
  const {setUsername: setLoggedInUsername, setId,setIsLoadingLogin, isLoadingLogin} = useContext(UserContext);

   function handleSubmits() {
    const url = isLoginOrRegister === '/user/register' ? '/user/register' : '/user/login';
    const params = {
      username: values?.userName,
      password: values?.password,
    }
    axios?.post(url, params).then(response => {
      setLoggedInUsername(values?.userName);
      setId(response?.id);
    }).catch(error => {
      console.log("error",error);
    });
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: '',
      password: '',
    },
    validationSchema: Yup?.object()?.shape({
      userName: Yup?.string()?.required('userName is required'),
      password: Yup?.string()?.required('pass word is required'),
    }),
    onSubmit: async (values, {setSubmitting, setErrors}) => {
      try {
        handleSubmits();
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });
  const {
    errors,
    touched,
    values,
    // isSubmitting,
    handleSubmit,
    getFieldProps,
    resetForm,
    setFieldValue,
    setSubmitting,
    setErrors,
    handleChange,
    validateForm
  } = formik;

    const google = () => {
        window.open("http://localhost:7878/user/google", "_self");
    };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
            <input
                {...getFieldProps('userName')}
                name="userName"
                id="userName"
                type="text"
                placeholder="userName"
                onChange={(event) => {
                  handleChange(event);
                }}
                className="block w-full rounded-sm p-2 mb-2 border"
            />
            <div style={{ color: "red" }}>{touched?.userName && errors?.userName}</div>
            <input
                {...getFieldProps('password')}
                 type="password"
                 name="password"
                 id="password"
                 placeholder="password"
                 onChange={(event) => {
                   handleChange(event);
                 }}
                 className="block w-full rounded-sm p-2 mb-2 border"
            />
          <div style={{ color: "red" }}>{touched?.password && errors?.password}</div>
            <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
              {isLoginOrRegister === 'register' ? 'register' : 'login'}
            </button>
            <div className="text-center mt-2">
              {isLoginOrRegister === 'register' && (
                <div>
                  Already a member?
                  <button className="ml-1" onClick={() => setIsLoginOrRegister('login')}>
                    Login here
                  </button>
                </div>
              )}
              {isLoginOrRegister === 'login' && (
                <div>
                  Dont have an account?
                  <button className="ml-1" onClick={() => setIsLoginOrRegister('register')}>
                    Register
                  </button>
                </div>
              )}
                <GoogleButton
                    label='Login Google'
                    className="ml-1"
                    onClick={google}
                />
            </div>
        </Form>
      </FormikProvider>
    </div>
  );
}