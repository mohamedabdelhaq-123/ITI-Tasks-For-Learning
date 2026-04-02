import React from 'react'

const skillsList = [
    { category: "Web Development", items: "HTML5, CSS3, JS, Bootstrap, Flask, REST APIs" },
    { category: "Infrastructure", items: "SQL, MongoDB, Git/GitHub, Linux" },
    { category: "System Architecture", items: "C++, C, Java, DSA" },
    { category: "DS / ML", items: "Python, Pandas, Scikit-Learn, Visualization" }
  ];

function Skills() {
return (
    <section className="py-16 bg-gray-800 text-white px-6">
      <h2 className="text-3xl font-bold text-center mb-10 text-green-400">Skills</h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillsList.map((skill, index) => (
          <div key={index} className="bg-gray-900 p-6 rounded-xl text-center border border-gray-700 hover:border-green-400 transition">
            <h3 className="text-lg font-bold mb-4 text-green-400">{skill.category}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{skill.items}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
