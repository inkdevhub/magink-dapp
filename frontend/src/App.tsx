import "./App.css";
import { Routes, Route } from "react-router-dom";
import { FormContainer, Loader } from "./components";
import { useMaginkContract } from "./hooks";

function App() {
  const { magink } = useMaginkContract();

  if (!magink) return <Loader message="Loading app..." />

  return (
    <Routes>
      <Route index element={<FormContainer />} />
      <Route path="/magink-dapp" element={<FormContainer />} />
    </Routes>
  );
}

export default App;
