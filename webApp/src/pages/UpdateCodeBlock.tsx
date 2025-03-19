import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateCodeBlock.css'; 


interface CodeBlock {
  _id: string;
  title: string;
  initialCode: string;
  solution: string;
}

function UpdateCodeBlock() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('');
  const [initialCode, setInitialCode] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchCodeBlock = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/codeBlocks/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CodeBlock = await response.json();
        setTitle(data.title);
        setInitialCode(data.initialCode);
        setSolution(data.solution);
      } catch (err) {
        console.error('Error fetching code block:', err);
        setError('Failed to load code block. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCodeBlock();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedCodeBlock = { title, initialCode, solution };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/codeBlocks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCodeBlock),
      });

      if (!response.ok) {
        throw new Error('Failed to update code block');
      }

      navigate('/'); 
    } catch (err) {
      console.error('Error updating code block:', err);
      setError('Failed to update code block. Please try again later.');
    }
  };


  if (loading) {
    return (
      <div className="loading-container">
        <h1>Update Code Block</h1>
        <p>Loading code block...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="error-container">
        <h1>Update Code Block</h1>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="update-code-block-container">
      <h1>Update Code Block</h1>
      <form onSubmit={handleSubmit} className="update-code-block-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Initial Code:</label>
          <textarea
            value={initialCode}
            onChange={(e) => setInitialCode(e.target.value)}
            required
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label>Solution:</label>
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            required
            className="form-textarea"
          />
        </div>
        <button type="submit" className="submit-button">
          Update Code Block
        </button>
      </form>
    </div>
  );
}

export default UpdateCodeBlock;