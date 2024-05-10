const express = require('express');
const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require("cors")

const app = express();
app.use(cors())
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const zip = new AdmZip(req.file.buffer);
    const tempDir = path.join(__dirname, 'temp'); // Create a temporary directory
    zip.extractAllTo(tempDir, true); // Extract zip contents to the temporary directory

    // Run npx serve on the temporary directory with the --open flag
    exec(`npx serve ${tempDir} -l 3003`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running npx serve: ${error.message}`);
            res.status(500).send('Internal server error');
            return;
        }

        console.log(`npx serve stdout: ${stdout}`);
        console.error(`npx serve stderr: ${stderr}`);
        
        
    });
    res.send(`Serving extracted files with npx serve on port ...`);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});