import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './pages/Lobby';
import CodeBlock from './pages/CodeBlock';
import CreateCodeBlock from './pages/CreateCodeBlock';
import UpdateCodeBlock from './pages/UpdateCodeBlock';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/codeblock/:id" element={<CodeBlock />} />
        <Route path="/create-codeblock" element={<CreateCodeBlock />} /> 
        <Route path="/update-codeblock/:id" element={<UpdateCodeBlock />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
