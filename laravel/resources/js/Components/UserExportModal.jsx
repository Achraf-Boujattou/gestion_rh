import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserExportModal({ show, onClose }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (show) {
      axios.get("/api/users").then(res => setUsers(res.data.users));
    }
  }, [show]);

  const handleExport = (format) => {
    window.location.href = `/api/users/export/${format}`;
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
      <div className="modal" style={{background:'#fff',padding:24,borderRadius:8,minWidth:400}}>
        <h2>Liste des utilisateurs</h2>
        <table style={{width:'100%',marginBottom:16}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => handleExport('csv')} style={{marginRight:8}}>Exporter CSV</button>
        <button onClick={() => handleExport('xlsx')} style={{marginRight:8}}>Exporter Excel</button>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
} 