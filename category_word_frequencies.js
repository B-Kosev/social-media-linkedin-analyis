const fs = require('fs');
const path = require('path');

// Function to read CSV file and process the titles
function processCsvFile(inputFileName) {
    const inputFilePath = path.join(__dirname, inputFileName);
    console.log(`Reading CSV file from: ${inputFilePath}`);

    // Read the CSV file
    fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        try {
            // Split the data into rows and get the header
            const rows = data.split('\n');
            const categoryWordCounts = {
                'Engineer': {},
                'Developer': {},
                'Data Scientist': {},
                'Manager': {},
                'Designer': {},
                'Analyst': {},
                'Consultant': {},
                'Architect': {},
                'Specialist': {}
            };

            // Process each row (excluding the header row)
            rows.slice(1).forEach(row => {
                if (row) {
                    const columns = row.split(',');

                    // Assuming the 'title' is in the third column (update index if needed)
                    const title = columns[2]; 

                    if (title) {
                        // Clean and split the title into words
                        const words = title
                            .toLowerCase()
                            .replace(/[^a-zA-Z\s]/g, '')
                            .split(/\s+/);

                        // Categorize based on keywords in the title
                        categorizeTitleAndCountWords(title, words, categoryWordCounts);
                    }
                }
            });

            // Prepare CSV output
            let csvOutput = 'Category,Word,Count\n';

            for (const [category, wordCount] of Object.entries(categoryWordCounts)) {
                const sortedWords = Object.entries(wordCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10); // Get top 10 words for each category

                sortedWords.forEach(([word, count]) => {
                    csvOutput += `${category},${word},${count}\n`;
                });
            }

            // Define the output file path in the 'public' folder
            const outputFileName = 'category_word_frequencies.csv';
            const outputFolderPath = path.join(__dirname, 'public');
            
            // Ensure the 'public' folder exists, if not create it
            if (!fs.existsSync(outputFolderPath)) {
                fs.mkdirSync(outputFolderPath);
            }

            const outputFilePath = path.join(outputFolderPath, outputFileName);

            // Save the CSV output to a file in the 'public' folder
            fs.writeFile(outputFilePath, csvOutput, (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log(`Category word frequencies saved to ${outputFilePath}`);
            });

        } catch (err) {
            console.error('Error processing CSV data:', err);
        }
    });
}

// Function to categorize titles and count words in each category
function categorizeTitleAndCountWords(title, words, categoryWordCounts) {
    const categories = [
        { name: 'Engineer', keywords: ['engineer', 'developer', 'software', 'programmer'] },
        { name: 'Developer', keywords: ['developer', 'software', 'programmer'] },
        { name: 'Data Scientist', keywords: ['data', 'scientist', 'analytics', 'machine learning'] },
        { name: 'Manager', keywords: ['manager', 'lead', 'team'] },
        { name: 'Designer', keywords: ['designer', 'ux', 'product', 'graphic'] },
        { name: 'Analyst', keywords: ['analyst', 'business', 'data', 'research'] },
        { name: 'Consultant', keywords: ['consultant', 'advisor', 'strategist'] },
        { name: 'Architect', keywords: ['architect', 'cloud', 'infrastructure'] },
        { name: 'Specialist', keywords: ['specialist', 'expert', 'consultant'] }
    ];

    categories.forEach(category => {
        if (category.keywords.some(keyword => title.toLowerCase().includes(keyword))) {
            words.forEach(word => {
                if (word) {
                    categoryWordCounts[category.name][word] = (categoryWordCounts[category.name][word] || 0) + 1;
                }
            });
        }
    });
}

// Example usage
const inputFileName = 'title_stats.csv'; // The CSV file name
processCsvFile(inputFileName);
