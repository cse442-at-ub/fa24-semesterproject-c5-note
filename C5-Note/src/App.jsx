import './App.css';
import { HashRouter  as Router,Routes,Route,Link } from "react-router-dom";
import { Home } from './Pages/home';
import { Page1 } from './Pages/page1';
import { Simple_notebook } from './Pages/simple_notebook';
import { PageNotebooks } from './Pages/notebooks';
import { SignUpPage } from './Pages/signUpPage';
import { Forgot_login } from './Pages/forgot_login';
import { Reset_Password } from './Pages/reset_password';



function App() {

  return (
    <Router basename=''>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/next" element={ <Page1/> }/>
        <Route path="/note" element={ <Simple_notebook/> }/>
        <Route path="/notebooks" element = { <PageNotebooks/> }/>
        <Route path="/signUpPage" element = { <SignUpPage/> }/>
        <Route path="/forgot_login" element = { <Forgot_login/> }/>
        <Route path="/reset_password" element = { <Reset_Password/> }/>
      </Routes>
    </Router>
  )

}



export default App;
