import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

function NotFound() {
    const navigate = useNavigate(); // hooks are called at top of func
return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-9xl font-black text-gray-200">404</h1>

      <div className="mt-4">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Wrong place to go
        </h2>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
      </div>

      <div className="mt-10">
        <button
          onClick={() => navigate("/products")}
          className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Go Back to Products
        </button>
      </div>
    </main>
  );
}

export default NotFound

// hooks must be called in top of react func. component not regular func.
// because react relies on the order of execution of funct. component and the hooks must be at top 
// if hook is in callback it won't run on every render => react loses tracks


{/* <Navigate/> renders immediately when it appears in JSX — 
you can't put it in an onClick. 
That's the imperative vs declarative */}