import React from 'react'
import { useFormik } from 'formik'
import * as YUP from 'yup'
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    
    const userSchema = YUP.object({
        name: YUP.string().required('Name is Required'),
        username: YUP.string().matches(/^\S*$/, "No whitespaces").required('Username is Required'),
        email: YUP.string().email("Invalid Email").required("Email is Required"),
        password: YUP.string().min(8, "Password length must be more than 8 characters").matches(/[A-Z]/, "Must contain at least uppercase letter").required("Password is required"),
        confirmPassword: YUP.string().oneOf([YUP.ref("password")], "Passwords must match").required("Confirm Password is required")
    })

    const formik = useFormik({
        initialValues: {
            name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationSchema: userSchema,
        onSubmit: (values) => { navigate('/products') },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                        Create an Account
                    </h2>
                </div>
                <form className="mt-8 space-y-5" onSubmit={formik.handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            onBlur={formik.handleBlur}
                            className={`mt-1 block w-full px-3 py-2 border ${formik.errors.name && formik.touched.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {formik.errors.name && formik.touched.name && <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div>}
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            onBlur={formik.handleBlur}
                            className={`mt-1 block w-full px-3 py-2 border ${formik.errors.username && formik.touched.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {formik.errors.username && formik.touched.username && <div className="text-red-500 text-xs mt-1">{formik.errors.username}</div>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            onBlur={formik.handleBlur}
                            className={`mt-1 block w-full px-3 py-2 border ${formik.errors.email && formik.touched.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {formik.errors.email && formik.touched.email && <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            onBlur={formik.handleBlur}
                            className={`mt-1 block w-full px-3 py-2 border ${formik.errors.password && formik.touched.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {formik.errors.password && formik.touched.password && <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            onChange={formik.handleChange}
                            value={formik.values.confirmPassword}
                            onBlur={formik.handleBlur}
                            className={`mt-1 block w-full px-3 py-2 border ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        />
                        {formik.errors.confirmPassword && formik.touched.confirmPassword && <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>}
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0f172a] hover:bg-[#1e293b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f172a] mt-6 transition-colors duration-200"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register
