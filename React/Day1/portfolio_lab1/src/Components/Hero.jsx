import React from 'react'

function Hero() {
  return (
    <section className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white text-center px-4">
      <p className="text-xl text-green-400 mb-2">Hello, I'm</p>
      <h1 className="text-5xl md:text-6xl font-bold mb-4">Mohamed Abdelhaq</h1>
      <h2 className="text-2xl md:text-3xl text-gray-300 mb-8">Software Engineer</h2>
      
      <div className="flex gap-6 text-3xl">
        <a href="https://github.com/mohamedabdelhaq-123" target="_blank" rel="noreferrer" className="hover:text-green-400 transition">
          <i className="fab fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/mohamed-abdelhaq/" target="_blank" rel="noreferrer" className="hover:text-green-400 transition">
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
    </section>
  );
}

export default Hero
