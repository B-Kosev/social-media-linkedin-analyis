const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

// Function to run a shell command (script) and return a promise
function runScript(scriptPath) {
    return new Promise((resolve, reject) => {
        exec(`node ${scriptPath}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing ${scriptPath}: ${stderr}`);
                return;
            }
            console.log(stdout);  // Output from the script
            resolve();
        });
    });
}

// Run all the scripts in sequence
async function runAllScripts() {
    try {
        // Run the scripts in sequence
        await runScript(path.join(__dirname, 'title_stats.js'));
        await runScript(path.join(__dirname, 'category_word_frequencies.js'));
        await runScript(path.join(__dirname, 'top_1000_words.js'));
        await runScript(path.join(__dirname, 'word_clustering.js'));

        // Once all scripts are done, start the server
        startServer();
    } catch (error) {
        console.error('Error running scripts:', error);
    }
}

// Function to start the server
function startServer() {
    // Serve static files (HTML, CSS, JS, CSV) from the "public" folder
    app.use(express.static(path.join(__dirname, 'public')));

    // Route to serve the main HTML file
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

// Start the script execution and server after all scripts have run
runAllScripts();
