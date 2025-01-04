const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Predefined categories for clustering words
const predefinedClusters = {
    'AI': ['ai', 'machine learning', 'deep learning', 'neural network', 'data science', 'algorithm'],
    'Cybersecurity': ['security', 'cybersecurity', 'firewall', 'encryption', 'data protection', 'privacy'],
    'Software Development': ['software', 'development', 'programming', 'coding', 'developer', 'engineer'],
    'Business Analysis': ['business', 'analysis', 'strategy', 'consulting', 'data analysis', 'research'],
    'Design': ['design', 'ux', 'user experience', 'interface', 'graphic', 'product design'],
};

// Function to read and process the `title_stats.csv` file
function processWordClusteringFromCSV(inputFileName) {
    const inputFilePath = path.join(__dirname, inputFileName);
    console.log(`Reading CSV file from: ${inputFilePath}`);

    const wordFrequencies = {};

    // Read the CSV file line by line
    const rl = readline.createInterface({
        input: fs.createReadStream(inputFilePath),
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        // Split the CSV line into columns
        const columns = line.split(',');

        // Assuming the title is in the third column (adjust the index if needed)
        const title = columns[2]?.toLowerCase().replace(/[^a-zA-Z\s]/g, '');

        if (title) {
            // Split title into words
            const words = title.split(/\s+/);
            words.forEach(word => {
                wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
            });
        }
    });

    rl.on('close', () => {
        // Process the word frequencies to cluster words
        const clusters = clusterWords(Object.keys(wordFrequencies));

        // Save the clusters to a CSV file in the public folder
        saveClustersToCSV(clusters);
    });
}

// Function to cluster words into predefined categories
function clusterWords(words) {
    const clusters = {};

    // Initialize clusters with empty arrays
    for (const clusterName of Object.keys(predefinedClusters)) {
        clusters[clusterName] = [];
    }

    // For each word, try to assign it to a cluster
    words.forEach(word => {
        let clustered = false;
        for (const [clusterName, clusterWords] of Object.entries(predefinedClusters)) {
            if (clusterWords.some(clusterWord => word.includes(clusterWord))) {
                clusters[clusterName].push(word);
                clustered = true;
                break;
            }
        }

        // If no category matched, add it to a Miscellaneous group
        if (!clustered) {
            if (!clusters['Miscellaneous']) {
                clusters['Miscellaneous'] = [];
            }
            clusters['Miscellaneous'].push(word);
        }
    });

    return clusters;
}

// Function to save clusters to a CSV file
function saveClustersToCSV(clusters) {
    const outputFileName = 'word_clustering.csv';
    const outputFilePath = path.join(__dirname, 'public', outputFileName); // Save the file in 'public' folder

    let csvOutput = 'Cluster,Word\n';

    for (const [clusterName, words] of Object.entries(clusters)) {
        words.forEach(word => {
            csvOutput += `${clusterName},${word}\n`;
        });
    }

    fs.writeFile(outputFilePath, csvOutput, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log(`Word clustering results saved to ${outputFilePath}`);
    });
}

// Example usage
const inputFileName = 'title_stats.csv'; // The CSV file containing job titles
processWordClusteringFromCSV(inputFileName);
