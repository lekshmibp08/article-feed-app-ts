import React, { useEffect, useState } from "react";
import configAxios from "../services/axiosConfig";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { IUser } from "../types/types";
import { sendOtp, verifyAndRegister } from '../api/userApi'

Modal.setAppElement("#root"); 

const step1ValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Za-z]{3,20}$/, 'First Name must be 3-20 letters and contain only alphabets')
    .required('First Name is required'),
    

  lastName: Yup.string()
    .matches(/[A-Za-z]/, 'Last Name must contain at least one alphabet')
    .required('Last Name is required'),

  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),

  phone: Yup.string()
    .matches(/^\d{10}$/, 'Mobile Number must be 10 digits')
    .required('Mobile Number is required'),

  password: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Password must be at least 6 characters long and include a letter, a number, and a special character'
    )
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords do not match.')
    .required('Confirm Password is required'),

  preferences: Yup.array()
    .min(1, 'At least one preference must be selected')
    .required('At least one preference must be selected'),
});

const SignupForm: React.FC = () => {

  const [step, setStep] = useState<number>(1);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [timer, setTimer] = useState<number>(60);

  const preferenceOptions: string[] = ["Sports", "Politics", "Technology", "Space", "Health", "Entertainment", "Science", "Business"];
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) return prevTimer - 1;
          clearInterval(interval);
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [step]);

  // Format the timer as MM:SS
  const formatTimer = (time: number): string => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Step 1: Register and Request OTP
  const handleRegister = async (values: Partial<IUser>) => {
    setError('');
    
    try {
      const response = await sendOtp({ email: values.email, phone: values.phone });
      setMessage(response.data.message);
      setStep(2); 
      setTimer(60); // Reset timer for 2 minutes
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (values: Partial<IUser>) => {
    setError('');
    setMessage('');
    try {
      const response = await verifyAndRegister(values);
      setMessage(response.data.message);
      navigate('/login'); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify OTP. Please try again.');
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
        {step === 1 ? 'Create an account' : 'Verify OTP'}
        </h2>

        {message && <div className="text-green-600 text-center mb-4">{message}</div>}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        {step === 1 ? (
          <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            preferences: []
          }}
          validationSchema={step1ValidationSchema}
          onSubmit={(values) => handleRegister(values)}
          >
            {() => (
              <Form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <label className="block text-gray-700 text-sm mb-1">
                  First name
                </label>
                <Field
                    type="text"
                    name="firstName"
                    placeholder="John"
                    className="w-full border rounded-md px-3 py-2"
                  />
                  <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <label className="block text-gray-700 text-sm mb-1">
                  Last name
                </label>
                <Field
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    className="w-full border rounded-md px-3 py-2"
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <label className="block text-gray-700 text-sm mb-1">
                  Email
                </label>
                <Field
                    type="text"
                    name="email"
                    placeholder="m@example.com"
                    className="w-full border rounded-md px-3 py-2"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <label className="block text-gray-700 text-sm mb-1">
                  Mobile Number
                </label>
                <Field
                    type="text"
                    name="phone"
                    placeholder="1234567890"
                    className="w-full border rounded-md px-3 py-2"
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <label className="block text-gray-700 text-sm mb-1">
                  Password
                </label>
                <Field
                    type="password"
                    name="password"
                    className="w-full border rounded-md px-3 py-2"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                <label className="block text-gray-700 text-sm mb-1">
                  Confirm Password
                </label>
                <Field
                    type="password"
                    name="confirmPassword"
                    className="w-full border rounded-md px-3 py-2"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
                </div>

                {/* Preferences */}
                <div>
                  <label className="block text-gray-700 text-sm mb-1">Preferences</label>
                  <div className="grid grid-cols-2 gap-2">
                    {preferenceOptions.map((pref) => (
                      <label key={pref} className="flex items-center">
                        <Field 
                          type="checkbox" 
                          name="preferences" 
                          value={pref} 
                          className="mr-2" 
                        />
                        {pref}
                      </label>
                    ))}
                  </div>
                  <ErrorMessage name="preferences" component="div" className="text-red-600 text-sm" />
                </div>       

                <button 
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
                  Create account
                </button>                

              </Form>
            )}

          </Formik>
        ) : (
          <Formik
            initialValues={{ otp: '' }}
            onSubmit={(values) => handleVerifyOtp(values)}
          >
            {() => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-customTeal"
                  />
                </div>
                <button
                  type="submit"                  
                  className={`w-full py-2 rounded  bg-blue-600 text-white transition ${timer > 0 ? 
                    ' hover:bg-blue-700' : 
                    'opacity-50 cursor-not-allowed' }`} 
                  
                    disabled={timer === 0}
                >
                  Verify OTP
                </button>
              </Form>
            )}
          </Formik>

        )}
        <div className="mt-2 text-center text-sm text-muted-foreground">
          {step === 1 ? (
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-primary underline">
                Sign in
              </a>
            </p>
          ) : (
            <>
              <div className="text-center text-gray-600 mb-2">Time Remaining: {formatTimer(timer)}</div>
              <button
                onClick={() => {
                  if (timer === 0) {
                    setStep(1);
                    setError('');
                    setMessage('');
                  }
                }}
                className={`text-blue-600 focus:outline-none ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
                disabled={timer > 0} 
              >
                Back to Register
              </button>
            </>
          )}
          </div>
      </div>
    </div>
  );
};

export default SignupForm;
