const express = require('express');
const multer = require('multer');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cors = require("cors")
const http = require('http');
const https = require('https');
// import downloadAndExtractZip from './utils/extractAndPlay';

const app = express();
app.use(cors())
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Function to download a file from a URL to a specified location
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
  
      // Make a GET request to the URL
      protocol.get(url, (response) => {
        // Check if the response is successful (status code 200)
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download file. Status code: ${response.statusCode}`));
          return;
        }

        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
  
        // Create a writable stream to save the file
        const fileStream = fs.createWriteStream(dest);
  
        // Pipe the response to the file stream
        response.pipe(fileStream);
  
        // Resolve the promise when the download is complete
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
  
        // Handle errors during the download
        fileStream.on('error', (err) => {
          fs.unlink(dest, () => {}); // Delete the file
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }
  
// Function to unzip a file
function unzipFileAndStartServer(zipFilePath) {
    return new Promise((resolve, reject) => {
      // Load the zip file
      const zip = new AdmZip(zipFilePath);
  
      // Extract the contents of the zip file
      zip.extractAllTo(path.dirname(zipFilePath), true);

      setTimeout(exec(`npx serve downloads -l 3003`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running npx serve: ${error.message}`);
            res.status(500).send('Internal server error');
            return;
        }
        console.log(`npx serve stdout: ${stdout}`);
        console.error(`npx serve stderr: ${stderr}`);
        });,2000)
  
      

         // Resolve the promise
         resolve();
    });
  }  

    
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const zip = new AdmZip(req.file.buffer);
    const tempDir = path.join(__dirname, 'tempPlay'); // Create a temporary directory
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


app.post("/play",async (req,res)=>{

    // console.log(req.body.url)
    const {url} = req.body;

    if (!url || typeof url !== 'string') {
        return res.status(400).send('Invalid data format. Please send a string.');
    }
    const ind = url.lastIndexOf('/')
    const fileName = url.substring(ind+1);

    console.log("file name is - ",fileName)
    const dest = path.join(__dirname, 'downloads', `${fileName}.zip`); // Destination path to save the file

    try {
        downloadFile(url, dest)
        .then(() => {
            console.log('File downloaded successfully!');
            // Unzip the downloaded file
            return unzipFileAndStartServer(dest);            
        })
        .catch((err) => {
            console.error('Failed to download file:', err);
        });
        res.send(`Serving extracted files with npx serve on port ...`);
    } catch (error) {
        res.status(404)
    }
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});