import './App.css';
import { HashRouter  as Router,Routes,Route,Link } from "react-router-dom";
import { Home } from './Pages/home';
import { Page1 } from './Pages/page1';
import { Simple_notebook } from './Pages/simple_notebook';
import { PageNotebooks } from './Pages/notebooks';
import { SignUpPage } from './Pages/signUpPage';
import { Profile } from './Pages/profile';



function App() {

  return (
    <Router basename=''>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/next" element={ <Page1/> }/>
        <Route path="/note" element={ <Simple_notebook/> }/>
        <Route path="/notebooks" element = { <PageNotebooks/> }/>
        <Route path="/signUpPage" element = { <SignUpPage/> }/>
        <Route path="/profile" element = { <Profile/> }/>
      </Routes>
    </Router>
  )

}



export default App;
