import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import Chat from '../components/Chat'; 
import './CodeBlock.css'; 

const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);

interface CodeBlock {
  _id: string;
  title: string;
  initialCode: string;
  solution: string;
}

const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
];

function CodeBlock() {
  const location = useLocation();
  const navigate = useNavigate();
  const { _id, title, initialCode, solution } = location.state as CodeBlock;

  const [code, setCode] = useState<string>(initialCode);
  const [role, setRole] = useState<'mentor' | 'student'>('mentor'); 
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('javascript'); 

  useEffect(() => {
    socket.emit('joinRoom', _id, initialCode);

    socket.on('assignRole', (assignedRole: 'mentor' | 'student') => {
      setRole(assignedRole); 
    });

    socket.on('initialCode', (initialCode: string) => {
      setCode(initialCode); 
    });

    socket.on('codeUpdate', (updatedCode: string) => {
      setCode(updatedCode);
    });

    socket.on('studentsCount', (count: number) => {
      setStudentsCount(count);
    });

    socket.on('mentorLeft', () => {
      if (role === 'student') {
        alert('Mentor has left the room. Redirecting to lobby...');
        navigate('/');
      }
    });

    socket.on('solutionSolved', (solved: boolean) => {
      setIsSolved(solved); 
    });

    return () => {
      socket.emit('leaveRoom', _id);

      socket.off('assignRole');
      socket.off('initialCode');
      socket.off('codeUpdate');
      socket.off('studentsCount');
      socket.off('mentorLeft');
      socket.off('solutionSolved');
    };
  }, [_id, navigate, role, initialCode]);

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode !== undefined && role === 'student') {
      setCode(newCode);
      socket.emit('codeChange', { room: _id, code: newCode });
  

      const normalizedCode = newCode.replace(/\s+/g, ''); 
      const normalizedSolution = solution.replace(/\s+/g, ''); 
  

      if (normalizedCode === normalizedSolution) {
        setIsSolved(true);
        socket.emit('solutionSolved', { room: _id, solved: true }); 
      } else {
        setIsSolved(false);
        socket.emit('solutionSolved', { room: _id, solved: false }); 
      }
    }
  };

  const handleExitRoom = () => {

    socket.emit('leaveRoom', _id);
    navigate('/');
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value); 
  };

  return (
    <div className="code-block-container">
      <div className="header">
        <h1>{title}</h1>
        <button onClick={handleExitRoom} className="exit-button">
          Exit Room
        </button>
      </div>


      {isSolved && (
        <div className="solved-message">
          <span role="img" aria-label="smiley">😊</span>
          <p>Congratulations! You solved the code!</p>
        </div>
      )}

      <div className="role-info">
        <p>You are the <span className={role}>{role}</span></p>
        <p>Students in room: <span className="student-count">{studentsCount}</span></p>
      </div>

      <div className="language-selector">
        <label htmlFor="language">Select Language: </label>
        <select id="language" value={language} onChange={handleLanguageChange}>
          {supportedLanguages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="editor-container">
        <Editor
          height="400px"
          width="100%"
          language={language} 
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          options={{ readOnly: role === 'mentor' }}
        />
      </div>


      <div className="chat-wrapper">
        <Chat roomId={_id} role={role} />
      </div>
    </div>
  );
}

export default CodeBlock;


