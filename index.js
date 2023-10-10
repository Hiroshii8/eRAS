const fs = require('fs');;
const pdf = require('pdf-parse');

// Function to extract text from a PDF file
async function extractTextFromPDF(pdfFilePath) {
    try {
        const dataBuffer = fs.readFileSync(pdfFilePath);
        const data = await pdf(dataBuffer);

        return data.text;
    } catch (error) {
        console.error('Error reading PDF:', error);
        throw error;
    }
}

const convertTextToTransaction = (text) => {
    // Define regular expressions for extracting transaction data
    const transactionRegex = /(\d{2}-[A-Z]{3})(\d{2}-[A-Z]{3})((([A-Z\s].+)(ID))|((CICILAN)([A-Z\s].+)(%1?)))([0-9,.]+)$/gm;

    // Initialize an array to store the extracted transactions
    const result = {
        transactions: [],
        total: 0,
    }

    // Match and extract transaction data from the text
    let match;
    while ((match = transactionRegex.exec(text)) !== null) {    
        console.log(match);
        const date = match[1];
        const description = match[3].replace(/\s+/g, ' ');;
        const amount = parseFloat(match[match.length-1].replace(/\./g, ''));

        // Create a transaction object and push it to the transactions array
        const transaction = {
            date,
            description,
            amount,
        };

        result.transactions.push(transaction);
        result.total+=amount;
    }

    return result;
};

const extractBCACreditCardStatement = async (pdfFilePath) => {
    const text = await extractTextFromPDF(pdfFilePath);
    const result = convertTextToTransaction(text);
    return result;
};

async function main() {
    const data = await extractBCACreditCardStatement('./data/bca/xxx-09-2023.pdf');
    console.log(data);
}

main().catch((err) => {
    console.log(err);
});