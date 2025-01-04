const fs = require('fs');
const path = require('path');

// Function to clean data, removing surrounding quotes, internal quotes, and commas from title
function cleanData(value, header) {
    if (header === 'title' && typeof value === 'string') {
        // Remove commas in the title field
        value = value.replace(/,/g, '');
    }

    if (typeof value === 'object') {
        // If it's an object or array, stringify it and remove quotes inside
        return JSON.stringify(value).replace(/"/g, '');
    }
    
    // If it's a string, remove any surrounding quotes
    if (typeof value === 'string') {
        return value.replace(/^"(.+)"$/, '$1'); // Remove surrounding quotes from the string if present
    }

    return value; // Return other data types as-is
}

// Function to convert JSON to CSV format without adding quotes around data
function jsonToCsv(data) {
    const headers = Object.keys(data[0]);  // Get the headers from the first object
    const csvRows = [];

    // Add the headers row (no quotes)
    csvRows.push(headers.join(','));

    // Add the data rows (no quotes around the values)
    data.forEach(row => {
        const values = headers.map(header => {
            const cell = row[header];
            // Clean the data (remove internal quotes and commas in title) before adding to the CSV row
            return cleanData(cell, header);
        });
        csvRows.push(values.join(','));
    });

    return csvRows.join('\n');
}

// Function to convert JSON to CSV and save to a new file
function convertJsonToCsv(inputFileName, outputFileName) {
    const inputFilePath = path.join(__dirname, inputFileName);
    const outputFilePath = path.join(__dirname, outputFileName);

    // Read the JSON file
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        try {
            // Parse the JSON data
            const jsonData = JSON.parse(data);

            // Convert JSON to CSV
            const csvData = jsonToCsv(jsonData);

            // Write the CSV data to a new file
            fs.writeFile(outputFilePath, csvData, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }

                console.log(`CSV file saved as ${outputFileName}`);
            });
        } catch (err) {
            console.error('Error parsing JSON data:', err);
        }
    });
}

// Example usage
const inputFileName = 'allJobs.json'; // The JSON file name in the same directory
const outputFileName = 'title_stats.csv'; // The output CSV file name

// Convert JSON to CSV and save the output
convertJsonToCsv(inputFileName, outputFileName);
