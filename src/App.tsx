import type React from 'react';
import styles from './App.module.css';
import QRCodeGenerator from './components/QRCodeGenerator';

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <QRCodeGenerator />
    </div>
  );
};

export default App;
