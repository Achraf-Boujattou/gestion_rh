import React, { useState } from "react";
import axios from "axios";

export default function ImportBiometricsModal({ show, onClose }) {
  const [format, setFormat] = useState("csv");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("format", format);
    formData.append("file", file);

    try {
      await axios.post("/api/biometrics/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err) {
      alert("Erreur lors de l'import !");
    }
    setLoading(false);
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop" style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}}>
      <div className="modal" style={{background:'#fff',padding:24,borderRadius:8,minWidth:320}}>
        <h2>Importer des données biométriques</h2>
        <form onSubmit={handleSubmit}>
          <label>Format :</label>
          <select value={format} onChange={e => setFormat(e.target.value)}>
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="json">JSON</option>
          </select>
          <br />
          <label>Fichier :</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} required />
          <br />
          <button type="submit" disabled={loading} style={{marginTop:12}}>
            {loading ? "Importation..." : "Importer"}
          </button>
          <button type="button" onClick={onClose} style={{marginLeft:8}}>Fermer</button>
        </form>
        {success && <p style={{color:'green'}}>Importation réussie !</p>}
      </div>
    </div>
  );
} 