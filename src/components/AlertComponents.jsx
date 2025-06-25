import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AlertComponent.css'; // Kita akan buat file CSS khusus

const AlertComponent = () => {
  const [show, setShow] = useState(true);

  return (
    <div className="alert-container">
      <Alert 
        show={show} 
        variant="success" 
        onClose={() => setShow(false)} 
        dismissible
        className="fade-in-alert"
      >
        <Alert.Heading>Operasi Berhasil!</Alert.Heading>
        <p>
          Data Anda telah berhasil disimpan ke dalam sistem kami. Anda dapat melanjutkan
          ke langkah berikutnya.
        </p>
      </Alert>

      {!show && (
        <Button 
          variant="outline-primary" 
          onClick={() => setShow(true)}
          className="mt-3 pulse-button"
        >
          Tampilkan Alert Lagi
        </Button>
      )}
    </div>
  );
};

export default AlertComponent;