import React from 'react'
import { useFormik} from 'formik'
import * as YUP from 'yup'
import { useNavigate } from 'react-router-dom';
function Register() {
    const navigate = useNavigate();
    const userSchema= YUP.object({
        name:YUP.string().required('Name is Required'),
        username: YUP.string().matches(/^\S*$/,"No whitespaceses").required('Username is Required'), // no spaces
        email: YUP.string().email("Invalid Email").required("Email is Required"),
        password:YUP.string().min(8,"Password length must be more than 8 characters").matches(/[A-Z]/,"Must contain at least uppercase letter").required("Password is required"),
        confirmPassword: YUP.string().oneOf([YUP.ref("password")],"Passwords must match").required("Confirm Password is required")
    })

    const formik= useFormik({
        initialValues:{
            name:'',
            username:'',
            email:'',
            password:'',
            confirmPassword:''
        },
        validationSchema: userSchema,
        onSubmit: (values)=>{navigate('/products')},
    });

  return (
    
    <form onSubmit={formik.handleSubmit}>
       <label htmlFor="name">Name</label>
       <input
         id="name"
         name="name"
         type="text"
         onChange={formik.handleChange}
         value={formik.values.name}
         onBlur={formik.handleBlur}
       />
       {formik.errors.name && formik.touched.name && <div>{formik.errors.name}</div>}
       <label htmlFor="username">Username</label>
       <input
         id="username"
         name="username"
         type="text"
         onChange={formik.handleChange}
         value={formik.values.username}
            onBlur={formik.handleBlur}

       />
         {formik.errors.username && formik.touched.username && <div>{formik.errors.username}</div>} 
       <label htmlFor="email">Email Address</label>
       <input
         id="email"
         name="email"
         type="email"
         onChange={formik.handleChange}
         value={formik.values.email}
            onBlur={formik.handleBlur}
       />
         {formik.errors.email && formik.touched.email && <div>{formik.errors.email}</div>}
        <label htmlFor="password">Password</label>
       <input
         id="password"
         name="password"
         type="password"
         onChange={formik.handleChange}
         value={formik.values.password}
            onBlur={formik.handleBlur}
       />
            {formik.errors.password && formik.touched.password && <div>{formik.errors.password}</div>}
        <label htmlFor="password">Confirm Password</label>
       <input
         id="confirmPassword"
         name="confirmPassword"
         type="password"
         onChange={formik.handleChange}
         value={formik.values.confirmPassword}
            onBlur={formik.handleBlur}
       />
            {formik.errors.confirmPassword && formik.touched.confirmPassword && <div>{formik.errors.confirmPassword}</div>}
       <button type="submit">Submit</button>
    </form>
  )
}

export default Register
