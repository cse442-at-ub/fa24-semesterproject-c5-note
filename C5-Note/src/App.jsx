import './App.css';
import { BrowserRouter as Router,Routes,Route,Link } from "react-router-dom";
import { Home } from './Pages/home';
import { Page1 } from './Pages/page1';
import { Profile } from './Pages/profile';

function App() {

  return (
    <Router basename=''>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/next" element={ <Page1/> }/>
        <Route path="/notebook" element={ <Profile/> }/>
      </Routes>
    </Router>
  )

}

export default App;
