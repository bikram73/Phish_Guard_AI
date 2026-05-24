import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const inputPath = process.argv[2] || path.resolve('data', 'SMSSpamCollection');
const outputPath = process.argv[3] || path.resolve('public', 'spam-model.json');

function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^\w\s$£€@.]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => token.length > 1 || token === 'a' || token === 'i');
}

function readDataset(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const firstLine = lines[0].toLowerCase();
  const isCsv = firstLine.includes(',') && !firstLine.includes('\t');

  if (isCsv) {
    const header = lines[0].split(',').map((value) => value.trim().replace(/^"|"$/g, ''));
    const labelIndex = header.findIndex((value) => ['v1', 'label', 'spam_or_ham'].includes(value.toLowerCase()));
    const messageIndex = header.findIndex((value) => ['v2', 'message', 'text'].includes(value.toLowerCase()));

    return lines
      .slice(1)
      .map((line) => {
        const parts = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((value) => value.trim().replace(/^"|"$/g, ''));
        const label = parts[labelIndex >= 0 ? labelIndex : 0];
        const message = parts[messageIndex >= 0 ? messageIndex : 1];
        if (!label || !message) return null;
        return {
          label: String(label).trim().toLowerCase(),
          message: String(message).trim(),
        };
      })
      .filter(Boolean);
  }

  return lines
    .map((line) => {
      const tabIndex = line.indexOf('\t');
      if (tabIndex === -1) return null;
      return {
        label: line.slice(0, tabIndex).trim().toLowerCase(),
        message: line.slice(tabIndex + 1).trim(),
      };
    })
    .filter(Boolean);
}

function trainModel(records) {
  const spamCounts = new Map();
  const hamCounts = new Map();
  let spamMessages = 0;
  let hamMessages = 0;
  let spamTokens = 0;
  let hamTokens = 0;

  for (const record of records) {
    const isSpam = record.label === 'spam';
    const tokens = tokenize(record.message);

    if (isSpam) spamMessages += 1;
    else hamMessages += 1;

    for (const token of tokens) {
      const target = isSpam ? spamCounts : hamCounts;
      target.set(token, (target.get(token) || 0) + 1);
      if (isSpam) spamTokens += 1;
      else hamTokens += 1;
    }
  }

  const tokenCounts = {
    spam: Object.fromEntries(spamCounts),
    ham: Object.fromEntries(hamCounts),
  };

  const vocab = new Set([...spamCounts.keys(), ...hamCounts.keys()]);

  return {
    version: 1,
    priors: {
      spam: spamMessages / Math.max(records.length, 1),
      ham: hamMessages / Math.max(records.length, 1),
    },
    vocabSize: vocab.size,
    tokenCounts,
    totalTokens: {
      spam: spamTokens,
      ham: hamTokens,
    },
    metadata: {
      records: records.length,
      spamMessages,
      hamMessages,
      generatedAt: new Date().toISOString(),
      source: inputPath,
    },
  };
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Dataset not found: ${inputPath}`);
    console.error('Download the Kaggle dataset and place SMSSpamCollection in the data folder.');
    process.exit(1);
  }

  const records = readDataset(inputPath);
  if (records.length === 0) {
    console.error('No valid records were found in the dataset.');
    process.exit(1);
  }

  const model = trainModel(records);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(model, null, 2), 'utf8');

  console.log(`Trained model saved to ${outputPath}`);
  console.log(`Records: ${model.metadata.records}`);
  console.log(`Spam messages: ${model.metadata.spamMessages}`);
  console.log(`Ham messages: ${model.metadata.hamMessages}`);
}

main();
