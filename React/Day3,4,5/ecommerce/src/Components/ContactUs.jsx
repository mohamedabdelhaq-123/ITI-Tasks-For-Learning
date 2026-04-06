import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as YUP from 'yup';

function ContactUs() {

  const [successMessage, setSuccessMessage] = useState('');

    const contactSchema = YUP.object({
        firstName: YUP.string().required('First Name is Required'),
        lastName: YUP.string().required('Last Name is Required'),
        email: YUP.string().email("Invalid Email").required("Email is Required"),
        phoneNumber: YUP.string(), 
        message: YUP.string()
            .min(10, "Message must be at least 10 characters")
            .max(500, "Message cannot exceed 500 characters")
            .required("Message is Required")
    });

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            message: ''
        },
        validationSchema: contactSchema,
        onSubmit: (values, { resetForm }) => {
            setSuccessMessage("We will get back to you soon");
            resetForm();
            setTimeout(() => setSuccessMessage(''), 2000);
        },
    });

  return (
    <div>
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
        
        <form onSubmit={formik.handleSubmit}>
           <label htmlFor="firstName">First Name</label>
           <input
             id="firstName"
             name="firstName"
             type="text"
             onChange={formik.handleChange}
             value={formik.values.firstName}
             onBlur={formik.handleBlur}
           />
           {formik.errors.firstName && formik.touched.firstName && <div>{formik.errors.firstName}</div>}

           <label htmlFor="lastName">Last Name</label>
           <input
             id="lastName"
             name="lastName"
             type="text"
             onChange={formik.handleChange}
             value={formik.values.lastName}
             onBlur={formik.handleBlur}
           />
           {formik.errors.lastName && formik.touched.lastName && <div>{formik.errors.lastName}</div>}

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

           <label htmlFor="phoneNumber">Phone Number</label>
           <input
             id="phoneNumber"
             name="phoneNumber"
             type="tel"
             onChange={formik.handleChange}
             value={formik.values.phoneNumber}
             onBlur={formik.handleBlur}
           />
            {formik.errors.phoneNumber && formik.touched.phoneNumber && <div>{formik.errors.phoneNumber}</div>}
           <label htmlFor="message">Message</label>
           <textarea
             id="message"
             name="message"
             onChange={formik.handleChange}
             value={formik.values.message}
             onBlur={formik.handleBlur}
           />
           {formik.errors.message && formik.touched.message && <div>{formik.errors.message}</div>}

           <button type="submit">Submit</button>
        </form>
    </div>
  );
}

export default ContactUs;