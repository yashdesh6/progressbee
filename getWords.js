const fs = require('fs');
const path = require('path');

// Helper function to generate a random letter not in the current set
const generateRandomLetter = (currentSet) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let randomLetter;
    do {
        randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    } while (currentSet.has(randomLetter));
    return randomLetter;
};

// Helper function to generate all permutations for a given array of letters
const generatePermutations = (inputArr, minLength) => {
    const result = new Set();
    const permute = (arr, m = []) => {
        if (m.length >= minLength) {
            result.add(m.join(''));
        }
        if (m.length === inputArr.length) return;
        arr.forEach((item, index) => {
            let curr = arr.slice();
            let next = curr.splice(index, 1);
            permute(curr.slice(), m.concat(next));
        });
    };
    permute(inputArr);
    return result;
};

// Helper function to load the word list from a text file into a Set
const loadWordList = (filePath) => {
    const wordData = fs.readFileSync(filePath, 'utf8');
    return new Set(wordData.split(/\r?\n/).map(word => word.trim().toLowerCase()));
};

// Helper function to filter permutations against the word list
const filterValidWords = (permutations, wordList) => {
    return Array.from(permutations).filter(word => wordList.has(word));
};

// Main function to orchestrate generating letters, validating stages, and output
const loadAndPickRandomWord = (filePath) => {
  const data = fs.readFileSync(filePath, 'utf8');
  const words = data.split(/\r?\n/);
  const randomWord = words[Math.floor(Math.random() * words.length)];
  return randomWord;
};

// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
};

const main = async () => {
  const wordListPath = path.join('public', 'words.txt');
  const fourLetterWordsPath = path.join('public', 'fourLetterWords.txt');
  const wordList = loadWordList(wordListPath);
  const initialWord = loadAndPickRandomWord(fourLetterWordsPath);
  let currentSet = new Set(shuffleArray([...initialWord]));
  let stages = [];
  stages.push({ stage: Array.from(currentSet).join(''), words: filterValidWords(generatePermutations(Array.from(currentSet), 4), wordList) });
    // Initialize with 3 random letters

    for (let i = 4; i <= 7; i++) { // Incrementally add letters up to 8
        let newLetter;
        let newWords;
        let previousWordsCount = 0;
    

        do {
            newLetter = generateRandomLetter(currentSet);
            currentSet.add(newLetter);
            const currentLetters = Array.from(currentSet);
            const permutations = generatePermutations(currentLetters, 4);
            newWords = filterValidWords(permutations, wordList);

            // Calculate previous words count for comparison
            if (stages.length > 0) {
                previousWordsCount = stages[stages.length - 1].words.length;
            }

            // If the new letter doesn't contribute new words, remove it and try again
            if (newWords.length <= previousWordsCount) {
                currentSet.delete(newLetter);

            }
        } while (newWords.length <= previousWordsCount);

        stages.push({ stage: Array.from(currentSet).join(''), words: newWords });

        // Break the loop if we've successfully added all letters
        if (currentSet.size === 8) break;
    }

    const outputPath = path.join('public', 'validWords.json');
    fs.writeFileSync(outputPath, JSON.stringify({ letters: Array.from(currentSet), stages }, null, 2), 'utf8');
    console.log(`Generated letters and valid words organized into stages have been saved to validWords.json`);
};

main().catch(console.error);
