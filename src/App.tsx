import React from "react";
import styles from "./App.module.css";
import QRCodeGenerator from "./components/QRCodeGenerator";

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <QRCodeGenerator config={{} as any} onConfigChange={() => {}} />
    </div>
  );
};

export default App;
