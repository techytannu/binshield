# 🛡️ BinShield

**BinShield** is a **static binary malware analysis tool** that analyzes files **without executing them**.  
It converts binary data into grayscale visualizations and detects suspicious patterns using entropy analysis and pattern matching.

> ⚠️ BinShield focuses on **safe, static analysis** and does **not run or execute uploaded files**.

---

## 🔍 What BinShield Does

- Converts any file into a **binary grayscale image**
- Detects **high-entropy regions** (encrypted or packed data)
- Flags **suspicious binary patterns**
- Calculates **SHA-256 hash**
- Provides **risk assessment** (Low / Medium / High)
- Works entirely in **static analysis mode**

---

## ✨ Key Features

### 📁 File Analysis
- Supports any file type (PDF, EXE, etc.)
- Displays file metadata:
  - File name
  - Type
  - Size
  - Last modified date
  - SHA-256 hash

### 🖼️ Binary Visualization
- Each pixel represents **one byte**
- Brightness = byte value (0–255)
- Uniform regions may indicate padding or null bytes
- High-noise regions may indicate encryption or compression

### 📊 Entropy Analysis
- Entropy score (0–8)
- High entropy suggests:
  - Encrypted content
  - Packed binaries
  - Obfuscated malware

### 🚨 Risk Detection
- Highlights suspicious regions
- Shows total suspicious segments detected
- Displays overall **risk level**
  - 🟥 High Risk
  - 🟨 Medium Risk
  - 🟩 Low Risk

---

## 🧪 How It Works

1. User uploads a file
2. File is converted into raw binary
3. Binary bytes are mapped to a grayscale image
4. Entropy is calculated over binary segments
5. Pattern matching detects suspicious regions
6. A risk score is generated — **without executing the file**

---

## 🖥️ Screenshots

> Add these images to a `screenshots/` folder in your repo

```markdown
![Upload Screen](screenshots/upload.png)
![Binary Visualization](screenshots/visualization.png)
![Analysis Results](screenshots/results.png)
