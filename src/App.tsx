import Signup from "./pages/Signup/Signup";
import { useEffect, useState } from 'react';
import Login from "./pages/Login/login";
import Home from "./pages/Home/Home";




function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <div>
      {path === '/home' ? <Home /> : path === '/login' ? <Login /> : <Signup />}
    </div>
  );
}




export default App;