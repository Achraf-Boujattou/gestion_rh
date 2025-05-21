import React, { useState } from "react";
import ImportBiometricsModal from "./ImportBiometricsModal";

export default function ImportBiometricsButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          background: 'linear-gradient(90deg,#b2d0fc 0%,#1677ff 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 24,
          padding: '10px 24px',
          fontWeight: 'bold',
          margin: '8px 0',
          cursor: 'pointer'
        }}
      >
        import_biometrics
      </button>
      <ImportBiometricsModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
} 