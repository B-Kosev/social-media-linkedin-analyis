const fs = require('fs');
const path = require('path');

// Function to read CSV file and process the titles
function processCsvFile(inputFileName) {
    const inputFilePath = path.join(__dirname, inputFileName);

    // Read the CSV file
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        try {
            // Split the data into rows and get the header
            const rows = data.split('\n');

            // Initialize an object to count word occurrences
            const wordCount = {};

            // Process each row (excluding the header row)
            rows.slice(1).forEach(row => {
                if (row) {
                    const columns = row.split(',');

                    // Assuming the 'title' is in the third column (index 2)
                    const title = columns[2]; // Change the index if needed

                    if (title) {
                        // Clean and split the title into words
                        const words = title
                            .toLowerCase() // Convert to lowercase
                            .replace(/[^a-zA-Z\s]/g, '') // Remove punctuation
                            .split(/\s+/); // Split by spaces

                        // Count the occurrences of each word
                        words.forEach(word => {
                            if (word) {
                                wordCount[word] = (wordCount[word] || 0) + 1;
                            }
                        });
                    }
                }
            });

            // Convert word count object to an array of [word, count] pairs
            const wordArray = Object.entries(wordCount);

            // Sort the words by frequency (descending order)
            wordArray.sort((a, b) => b[1] - a[1]);

            // Get the top 1000 words
            const top1000Words = wordArray.slice(0, 1000);

            // Output the results to a file in CSV format inside the 'public' folder
            const outputFileName = 'top_1000_words.csv';
            const outputFilePath = path.join(__dirname, 'public', outputFileName); // Update to save in 'public' folder

            // Prepare the CSV content, starting with the header row
            const header = ['Rank', 'Word', 'Count'];
            const rowsCSV = top1000Words.map(([word, count], index) => {
                return [index + 1, word, count].join(','); // Format as CSV
            });

            // Combine the header and the rows
            const outputData = [header.join(',')].concat(rowsCSV).join('\n');

            // Write the results to the file
            fs.writeFile(outputFilePath, outputData, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log(`Top 1000 words saved to ${outputFilePath}`);
            });

        } catch (err) {
            console.error('Error processing CSV data:', err);
        }
    });
}

// Example usage
const inputFileName = 'title_stats.csv'; // The CSV file name
processCsvFile(inputFileName);
