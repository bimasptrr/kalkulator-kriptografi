// src/utils/ciphers.js

// --- 1. VIGENERE CIPHER ---
export const vigenere = (text, key, isDecrypt) => {
    if (!key) return text;
    let result = '';
    let j = 0;
    for (let i = 0; i < text.length; i++) {
        let c = text.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            let shift = key.toUpperCase().charCodeAt(j % key.length) - 65;
            if (isDecrypt) shift = (26 - shift) % 26;
            result += String.fromCharCode((c - 65 + shift) % 26 + 65);
            j++;
        } else if (c >= 97 && c <= 122) {
            let shift = key.toLowerCase().charCodeAt(j % key.length) - 97;
            if (isDecrypt) shift = (26 - shift) % 26;
            result += String.fromCharCode((c - 97 + shift) % 26 + 97);
            j++;
        } else {
            result += text.charAt(i);
        }
    }
    return result;
};

// --- 2. AFFINE CIPHER ---
const modInverse = (a, m) => {
    for (let x = 1; x < m; x++) if (((a % m) * (x % m)) % m === 1) return x;
    return 1;
};

export const affine = (text, a, b, isDecrypt) => {
    if (isNaN(a) || isNaN(b)) return text;
    let result = '';
    let aInv = isDecrypt ? modInverse(a, 26) : a;

    for (let i = 0; i < text.length; i++) {
        let c = text.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            let val = isDecrypt ? aInv * (c - 65 - b) : a * (c - 65) + b;
            while (val < 0) val += 26 * Math.ceil(Math.abs(val) / 26);
            result += String.fromCharCode((val % 26) + 65);
        } else if (c >= 97 && c <= 122) {
            let val = isDecrypt ? aInv * (c - 97 - b) : a * (c - 97) + b;
            while (val < 0) val += 26 * Math.ceil(Math.abs(val) / 26);
            result += String.fromCharCode((val % 26) + 97);
        } else {
            result += text.charAt(i);
        }
    }
    return result;
};

// --- 3. PLAYFAIR CIPHER ---
export const playfair = (text, matrixArr, isDecrypt) => {
    let m = matrixArr.join('').toUpperCase().replace(/J/g, 'I');
    if (m.length !== 25) return "Matriks harus 25 huruf!";
    
    let cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    if (!isDecrypt) {
        let paired = "";
        for (let i = 0; i < cleanText.length; i += 2) {
            paired += cleanText[i];
            if (i + 1 < cleanText.length) {
                if (cleanText[i] === cleanText[i + 1]) { paired += 'X'; i--; } 
                else { paired += cleanText[i + 1]; }
            } else { paired += 'X'; }
        }
        cleanText = paired;
    }

    let result = "";
    for (let i = 0; i < cleanText.length; i += 2) {
        let c1 = cleanText[i], c2 = cleanText[i + 1];
        let idx1 = m.indexOf(c1), idx2 = m.indexOf(c2);
        let r1 = Math.floor(idx1 / 5), c1_col = idx1 % 5;
        let r2 = Math.floor(idx2 / 5), c2_col = idx2 % 5;

        if (r1 === r2) {
            c1_col = isDecrypt ? (c1_col + 4) % 5 : (c1_col + 1) % 5;
            c2_col = isDecrypt ? (c2_col + 4) % 5 : (c2_col + 1) % 5;
        } else if (c1_col === c2_col) {
            r1 = isDecrypt ? (r1 + 4) % 5 : (r1 + 1) % 5;
            r2 = isDecrypt ? (r2 + 4) % 5 : (r2 + 1) % 5;
        } else {
            let temp = c1_col; c1_col = c2_col; c2_col = temp;
        }
        result += m[r1 * 5 + c1_col] + m[r2 * 5 + c2_col];
    }
    return result;
};

// --- 4. HILL CIPHER ---
export const hill = (text, matrix, size, isDecrypt) => {
    let cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    while (cleanText.length % size !== 0) cleanText += 'X'; 
    
    let K = matrix.map(Number);
    if (isDecrypt) return "[Peringatan] Dekripsi Hill membutuhkan Invers Matriks Modulo 26. Implementasi perhitungan invers matriks silakan merujuk pada modul perkuliahan.";

    let result = "";
    for (let i = 0; i < cleanText.length; i += size) {
        let vec = [];
        for (let j = 0; j < size; j++) vec.push(cleanText.charCodeAt(i + j) - 65);

        for (let row = 0; row < size; row++) {
            let sum = 0;
            for (let col = 0; col < size; col++) sum += K[row * size + col] * vec[col];
            result += String.fromCharCode((sum % 26) + 65);
        }
    }
    return result;
};

// --- 5. ENIGMA CIPHER ---
export const enigma = (text, rotors, isDecrypt) => {
    let cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
    let result = "";
    for (let i = 0; i < cleanText.length; i++) {
        let c = cleanText.charCodeAt(i) - 65;
        let shift = 0;
        rotors.forEach((r, idx) => { shift += (r.pos.charCodeAt(0) - 65) + idx; });
        
        let val = isDecrypt ? (c - shift) : (c + shift);
        while (val < 0) val += 26 * Math.ceil(Math.abs(val) / 26);
        result += String.fromCharCode((val % 26) + 65);
    }
    return result;
};