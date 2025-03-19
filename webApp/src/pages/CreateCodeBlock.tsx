import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateCodeBlock.css'; // Import CSS for styling

const CreateCodeBlock: React.FC = () => {
  const [title, setTitle] = useState('');
  const [initialCode, setInitialCode] = useState('');
  const [solution, setSolution] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCodeBlock = { title, initialCode, solution };

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/codeBlocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCodeBlock),
      });

      if (!response.ok) {
        throw new Error('Failed to create code block');
      }

      navigate('/');
    } catch (error) {
      console.error('Error creating code block:', error);
    }
  };

  return (
    <div className="create-code-block-container">
      <h2>Create a New Code Block</h2>
      <form onSubmit={handleSubmit} className="create-code-block-form">
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
          Create Code Block
        </button>
      </form>
    </div>
  );
};

export default CreateCodeBlock;