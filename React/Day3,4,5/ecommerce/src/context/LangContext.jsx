import { createContext, useState } from "react"

export const langContext = createContext(null);




function LangProvider({children}) { // broadcaster
    const [lang,setlang] = useState("en");

    const toggleLang = () => {
    setlang(prev => {
        const nextLang = prev === 'ar' ? 'en' : 'ar';
        
        document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = nextLang;
        
        return nextLang;
    });
    };


  return (
    <>
      <langContext.Provider value={{lang,toggleLang}}>
        {children}
      </langContext.Provider>
    </>
  )
}

export default LangProvider
 // pass the data and setter in specific way so children use it

 