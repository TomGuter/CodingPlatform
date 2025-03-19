import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Lobby.css'; 


interface CodeBlock {
  _id: string;
  title: string;
  initialCode: string;
  solution: string;
}

function Lobby() {
  const navigate = useNavigate();
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCodeBlocks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/codeBlocks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CodeBlock[] = await response.json();
        setCodeBlocks(data);
      } catch (err) {
        console.error('Error fetching code blocks:', err);
        setError('Failed to load code blocks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCodeBlocks();
  }, []); 


  const handleCodeBlockSelect = (codeBlock: CodeBlock) => {
    navigate(`/codeblock/${codeBlock._id}`, { state: codeBlock });
  };


  const handleDeleteCodeBlock = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/codeBlocks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete code block');
      }


      setCodeBlocks(codeBlocks.filter((block) => block._id !== id));
    } catch (err) {
      console.error('Error deleting code block:', err);
    }
  };


  const handleUpdateCodeBlock = (id: string) => {
    navigate(`/update-codeblock/${id}`);
  };


  if (loading) {
    return (
      <div className="loading-container">
        <h1>Choose code block</h1>
        <p>Loading code blocks...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="error-container">
        <h1>Choose code block</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="lobby-container">
      <h1>Choose code block</h1>
      <button
        className="create-button"
        onClick={() => navigate('/create-codeblock')}
      >
        Create New Code Block
      </button>
      <div className="code-blocks-grid">
        {codeBlocks.map((block) => (
          <div key={block._id} className="code-block-card">
            <div className="card-content" onClick={() => handleCodeBlockSelect(block)}>
              <h2>{block.title}</h2>
            </div>
            <div className="card-actions">
              <button
                className="update-button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleUpdateCodeBlock(block._id);
                }}
              >
                Update
              </button>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleDeleteCodeBlock(block._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Lobby;