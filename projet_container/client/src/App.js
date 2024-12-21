import React, { useEffect, useState } from 'react';
import './styles/App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);

  const backendUrl = 'http://localhost:3000';

  // Récupérer les messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.error('Erreur lors de la récupération des messages:', err);
      setError('Erreur lors de la récupération des messages');
    }
  };

  // Ajouter un nouveau message
  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      setError('Le message ne peut pas être vide.');
      return;
    }
    setError('');

    try {
      const response = await fetch(`${backendUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newMessage }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l’ajout du message.');
      }

      const newMsg = await response.json();
      setMessages([...messages, newMsg]); // Ajout du nouveau message à la liste
      setNewMessage(''); // Réinitialisation du champ
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l’ajout du message.');
    }
  };

  // Supprimer un message
  const handleDeleteMessage = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/messages/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du message.');
      }

      // Supprimer le message de la liste localement
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la suppression du message.');
    }
  };

  // Editer un message
  const handleEditMessage = (msg) => {
    setEditingMessage(msg); // Mettre le message en mode édition
  };

  // Sauvegarder l'édition du message
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingMessage.text.trim()) {
      setError('Le message ne peut pas être vide.');
      return;
    }
    setError('');

    try {
      const response = await fetch(`${backendUrl}/api/messages/${editingMessage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editingMessage.text }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du message.');
      }

      // Une fois l'édition sauvegardée, on recharge les messages pour s'assurer qu'ils sont à jour
      fetchMessages(); // Rafraîchissement des messages après l'édition
      setEditingMessage(null); // Sortir du mode édition

    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour du message.');
    }
  };

  // Charger les messages au démarrage
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="container">
      <h1 className="title">To-Do List</h1>
      <ul className="message-list">
        {messages.map((msg) => (
          <li key={msg.id} className="message-item">
            {editingMessage && editingMessage.id === msg.id ? (
              <form onSubmit={handleSaveEdit} className="edit-form">
                <input
                  type="text"
                  value={editingMessage.text}
                  onChange={(e) => setEditingMessage({ ...editingMessage, text: e.target.value })}
                  className="message-input"
                />
                <button type="submit" className="save-btn">Sauvegarder</button>
              </form>
            ) : (
              <>
                <p className="message-text">{msg.text}</p>
                <div className="buttons-container">
                  <button 
                    onClick={() => handleEditMessage(msg)} 
                    className="edit-btn"
                  >
                    Éditer
                  </button>
                  <button 
                    onClick={() => handleDeleteMessage(msg.id)} 
                    className="delete-btn"
                  >
                    Fait
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className="add-message-title">Ajouter une tâche</h2>
      <form onSubmit={handleAddMessage} className="message-form">
        <input
          type="text"
          placeholder="Écrivez une tâche..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
        />
        <button type="submit" className="add-btn">A faire</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default App;
