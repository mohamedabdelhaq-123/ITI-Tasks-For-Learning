import React from 'react'

function Contacts() {
  return (
    <footer className="py-12  bg-gray-950 text-white text-center border-t border-gray-800 ">
      <h3 className="text-2xl font-bold mb-2">Mohamed Abdelhaq</h3>
      <p className="text-gray-400 mb-6">Feel free to reach out for collaborations.</p>
      
      <div className="flex justify-center gap-6 text-2xl">
        <a href="mailto:mohamed.abdelhaq99@gmail.com" className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center hover:bg-green-400 hover:text-gray-900 transition">
          <i className="fas fa-envelope"></i>
        </a>
        <a href="https://github.com/mohamedabdelhaq-123" target="_blank" rel="noreferrer" className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center hover:bg-green-400 hover:text-gray-900 transition">
          <i className="fab fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/mohamed-abdelhaq/" target="_blank" rel="noreferrer" className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center hover:bg-green-400 hover:text-gray-900 transition">
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
    </footer>
  )
}

export default Contacts
