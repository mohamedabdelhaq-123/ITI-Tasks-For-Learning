import React from 'react'

  const educationData = [
    { school: "Information Technology Institute (ITI)", degree: "Open Source Application Development", date: "Oct 2025 - Jul 2026" },
    { school: "Digital Egypt Pioneers Initiative (DEPI)", degree: "Data Scientist Program", date: "Oct 2024 - May 2025" },
    { school: "Harvard University", degree: "CS50", date: "Sep 2022 - Feb 2023" },
    { school: "Egyptian Academy for Engineering", degree: "Mechatronics Engineering", date: "Oct 2020 - Jul 2025" }
  ];

function Education() {
  return (
    <section className="py-16 bg-gray-900 text-white px-6">
      <h2 className="text-3xl font-bold text-center mb-10 text-green-400">Education</h2>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {educationData.map((item, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg border-l-4 border-green-400 shadow-lg">
            <h3 className="text-xl font-bold">{item.school}</h3>
            <p className="text-gray-300 mt-1">{item.degree}</p>
            <p className="text-sm text-gray-400 mt-2 bg-gray-900 inline-block px-3 py-1 rounded-full">{item.date}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Education
