import { useState } from 'react';
import './App.css';
import { vigenere, affine, playfair, hill, enigma } from './utils/ciphers';

function App() {
  const [cipherType, setCipherType] = useState('vigenere');
  const [operationMode, setOperationMode] = useState('encrypt'); // Mode: 'encrypt' atau 'decrypt'
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');

  // --- STATES KUNCI ---
  const [vigenereKey, setVigenereKey] = useState('');
  const [affineA, setAffineA] = useState('');
  const [affineB, setAffineB] = useState('');
  const [playfairMatrix, setPlayfairMatrix] = useState("ABCDEFGHIKLMNOPQRSTUVWXYZ".split(''));
  const [hillSize, setHillSize] = useState(2);
  const [hillMatrix2, setHillMatrix2] = useState(['', '', '', '']);
  const [hillMatrix3, setHillMatrix3] = useState(Array(9).fill(''));
  const [rotors, setRotors] = useState([
    { type: 'I', pos: 'A' }, { type: 'II', pos: 'A' }, { type: 'III', pos: 'A' }
  ]);

  // --- HANDLERS ---
  const handlePlayfairChange = (index, val) => {
    const newMatrix = [...playfairMatrix];
    newMatrix[index] = val.toUpperCase().replace(/[^A-Z]/g, '');
    setPlayfairMatrix(newMatrix);
  };

  const handleHillChange = (size, index, val) => {
    if (size === 2) {
      const newM = [...hillMatrix2]; newM[index] = val; setHillMatrix2(newM);
    } else {
      const newM = [...hillMatrix3]; newM[index] = val; setHillMatrix3(newM);
    }
  };

  const handleRotorChange = (index, field, val) => {
    const newRotors = [...rotors];
    newRotors[index][field] = field === 'pos' ? val.toUpperCase().replace(/[^A-Z]/g, '') : val;
    setRotors(newRotors);
  };

  // --- EKSEKUSI ---
  const processCipher = () => {
    let result = "";
    const isDecrypt = operationMode === 'decrypt';

    if (cipherType === 'vigenere') {
      result = vigenere(inputText, vigenereKey, isDecrypt);
    } else if (cipherType === 'affine') {
      result = affine(inputText, parseInt(affineA), parseInt(affineB), isDecrypt);
    } else if (cipherType === 'playfair') {
      result = playfair(inputText, playfairMatrix, isDecrypt);
    } else if (cipherType === 'hill') {
      let matrix = hillSize === 2 ? hillMatrix2 : hillMatrix3;
      result = hill(inputText, matrix, hillSize, isDecrypt);
    } else if (cipherType === 'enigma') {
      result = enigma(inputText, rotors, isDecrypt);
    }
    setOutputText(result);
  };

  const renderKeyConfiguration = () => {
    switch (cipherType) {
      case 'vigenere':
        return (
          <div className="key-row">
            <div className="form-group">
              <label>Kata Kunci (Vigenere Key)</label>
              <input type="text" className="form-control" placeholder="Masukkan huruf (Contoh: RAHASIA)..." value={vigenereKey} onChange={(e) => setVigenereKey(e.target.value)} />
            </div>
          </div>
        );
      case 'affine':
        return (
          <div className="key-row">
            <div className="form-group">
              <label>Kunci A (Multiplier)</label>
              <input type="number" className="form-control" placeholder="Relatif prima thd 26 (Cth: 5, 7, 11)" value={affineA} onChange={(e) => setAffineA(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Kunci B (Shift)</label>
              <input type="number" className="form-control" placeholder="Nilai geseran (Cth: 8)" value={affineB} onChange={(e) => setAffineB(e.target.value)} />
            </div>
          </div>
        );
      case 'playfair':
        return (
          <div className="matrix-container">
            <label style={{ color: '#d4af37', fontWeight: 600, marginBottom: '0.5rem' }}>Matriks Playfair (5x5)</label>
            <div className="matrix-grid grid-5x5">
              {playfairMatrix.map((char, i) => (
                <input key={i} type="text" maxLength="1" className="matrix-input" value={char} onChange={(e) => handlePlayfairChange(i, e.target.value)} />
              ))}
            </div>
            <small style={{ marginTop: '0.8rem', color: '#888' }}>* Huruf I dan J biasanya disatukan.</small>
          </div>
        );
      case 'hill':
        return (
          <div className="matrix-container">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ color: '#d4af37', fontWeight: 600, margin: 0 }}>Ordo Matriks:</label>
              <select className="form-control" style={{ width: 'auto', padding: '0.4rem 1rem' }} value={hillSize} onChange={(e) => setHillSize(Number(e.target.value))}>
                <option value={2}>2 x 2</option>
                <option value={3}>3 x 3</option>
              </select>
            </div>
            <div className={`matrix-grid ${hillSize === 2 ? 'grid-2x2' : 'grid-3x3'}`}>
              {(hillSize === 2 ? hillMatrix2 : hillMatrix3).map((val, i) => (
                <input key={i} type="number" className="matrix-input" placeholder="0" value={val} onChange={(e) => handleHillChange(hillSize, i, e.target.value)} />
              ))}
            </div>
          </div>
        );
      case 'enigma':
        return (
          <div className="matrix-container">
            <label style={{ color: '#d4af37', fontWeight: 600, marginBottom: '1rem' }}>Pengaturan Rotor (Kiri ke Kanan)</label>
            <div className="enigma-wrapper">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rotor-module">
                  <span>Rotor {i + 1}</span>
                  <select className="form-control" value={rotors[i].type} onChange={(e) => handleRotorChange(i, 'type', e.target.value)}>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                  </select>
                  <input type="text" maxLength="1" className="form-control" placeholder="Pos" value={rotors[i].pos} onChange={(e) => handleRotorChange(i, 'pos', e.target.value)} style={{ fontWeight: 'bold' }} />
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="page-wrapper">
      <div className="app-container">
        <div className="crypto-card">
          <h1 className="title">Crypto Calculator</h1>

          {/* Area Algoritma Utama */}
          <div className="form-group">
            <label>Pilih Algoritma Kriptografi</label>
            <select className="form-control" value={cipherType} onChange={(e) => { setCipherType(e.target.value); setOutputText(''); }} style={{ fontWeight: 600 }}>
              <option value="vigenere">Vigenere Cipher</option>
              <option value="affine">Affine Cipher</option>
              <option value="playfair">Playfair Cipher</option>
              <option value="hill">Hill Cipher</option>
              <option value="enigma">Enigma Cipher</option>
            </select>
          </div>

          <div className="key-section">
            <h3 className="key-section-title">Konfigurasi Kunci</h3>
            {renderKeyConfiguration()}
          </div>

          {/* Sistem Toggle Mode */}
          <div className="mode-toggle">
            <button 
              className={`mode-btn ${operationMode === 'encrypt' ? 'active' : ''}`} 
              onClick={() => { setOperationMode('encrypt'); setInputText(''); setOutputText(''); }}
            >
              Mode Enkripsi
            </button>
            <button 
              className={`mode-btn ${operationMode === 'decrypt' ? 'active' : ''}`} 
              onClick={() => { setOperationMode('decrypt'); setInputText(''); setOutputText(''); }}
            >
              Mode Dekripsi
            </button>
          </div>

          {/* Area Input & Output Dinamis */}
          <div className="io-grid">
            <div className="form-group">
              <label>
                {/* Judul Input berubah dinamis berdasarkan mode yang dipilih */}
                {operationMode === 'encrypt' ? 'Plaintext (Input Pesan Asli)' : 'Ciphertext (Input Pesan Sandi)'}
              </label>
              <textarea 
                className="form-control" 
                placeholder={operationMode === 'encrypt' ? "Ketik plaintext di sini..." : "Ketik ciphertext di sini..."}
                value={inputText} 
                onChange={(e) => setInputText(e.target.value)}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label>
                {/* Judul Output berubah dinamis berdasarkan mode yang dipilih */}
                {operationMode === 'encrypt' ? 'Ciphertext (Hasil Enkripsi)' : 'Plaintext (Hasil Dekripsi)'}
              </label>
              <textarea 
                className="form-control output-textarea" 
                readOnly 
                placeholder="Hasil operasi akan muncul di sini..." 
                value={outputText}
              ></textarea>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-process" onClick={processCipher}>
              {operationMode === 'encrypt' ? 'PROSES ENKRIPSI' : 'PROSES DEKRIPSI'}
            </button>
          </div>

        </div>
      </div>

      <footer className="footer">
        <p className="highlight">Tugas Proyek Kriptografi Klasik</p>
        <p>&copy; 2026</p>
      </footer>
    </div>
  );
}

export default App;