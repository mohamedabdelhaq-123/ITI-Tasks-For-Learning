import React from 'react'

function Footer() {
  return (
    <footer className="text-center bg-white border-t border-gray-200 py-8 px-4 mt-auto">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} ONNO. All rights reserved.
        </p>
    </footer>
  )
}

export default Footer