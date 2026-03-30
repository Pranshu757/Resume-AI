import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import Home from "./components/Home/Home";
import UserInfo from "./components/User/UserInfo";
import Interview from "./components/Interview/Interview";
import Questions from "./components/Interview/Questions/Questions";
import { useState } from "react";
import Result from "./components/Interview/Result/Result";

const App = () => {
  const [userName, setuserName] = useState("");
  const [data, setdata] = useState([]);
  const [feedback, setfeedback] = useState([]);
  const [resultNumber, setresultNumber] = useState(0);
  const [countQue, setcountQue] = useState(0);
  const [finalRes, setfinalRes] = useState(0);
  return (
    <>
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home setuserName={setuserName}/>} />
    <Route path="/result" element={<UserInfo />} />
    <Route path="/interview" element={<Interview setdata={setdata} />} />
    <Route path="/questions" element={<Questions data={data} feedback={feedback} setfeedback={setfeedback} resultNumber={resultNumber} setresultNumber={setresultNumber} countQue={countQue} setcountQue={setcountQue} setfinalRes={setfinalRes}/>} />
    <Route path="/resultUser" element={<Result userName={userName}/>}/>

  </Routes>
</BrowserRouter>
    </>
  );
};

export default App;