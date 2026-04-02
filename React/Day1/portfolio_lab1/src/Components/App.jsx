import Bio from './Components/Bio'
import Hero from './Components/Hero'
import Education from './Components/Education'
import Contacts from './Components/Contacts'
import Skills from './Components/Skills'

function App() {
  return (
    <div className="w-full m-0 p-0 overflow-x-hidden">
      <Hero />
      <Bio />
      <Education />
      <Skills />
      <Contacts />
    </div>
  )
}

export default App
