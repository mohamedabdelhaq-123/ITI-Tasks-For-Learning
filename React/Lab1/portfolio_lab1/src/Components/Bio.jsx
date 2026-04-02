import './Bio.css';
import resumePDF from "../assets/Mohamed Abdelhaq Resume.pdf"
export default function Bio() {
  return (
    <section className="bio-section">
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 'bold' }}>About Me</h2>
      <p className="bio-text">
        Specializing in the intersection of Web Development and Machine Learning. 
        Leveraging deep expertise in Data Science and backend architecture to deliver impactful solutions.
      </p>
    <a href={resumePDF} download="Mohamed_Abdelhaq_CV.pdf" className="download-btn">
      Download CV
    </a>
    </section>
  );
}