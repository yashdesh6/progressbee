import { useState, useEffect } from 'react';
import { Input, Button } from '@chakra-ui/react';

export default function GamePage() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [letters, setLetters] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [stages, setStages] = useState([]);
  const [correctWords, setCorrectWords] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState('');
  const [stageTransitionMessage, setStageTransitionMessage] = useState('');

  useEffect(() => {
    fetch('/validWords.json')
      .then(response => response.json())
      .then(data => {
        setStages(data.stages);
        setLetters(data.stages[0].stage);
      });
  }, []);

  useEffect(() => {
    // Check if all words for the current stage are found to move to next stage
    const currentStageWords = new Set(stages[currentStageIndex]?.words || []);
    const foundAllCurrentStageWords = Array.from(currentStageWords).every(word => correctWords.has(word));

    if (foundAllCurrentStageWords && currentStageIndex < stages.length - 1) {
      setStageTransitionMessage(`Great job! Moving on to stage ${currentStageIndex + 2}.`);
      setTimeout(() => setStageTransitionMessage(''), 3000); // Clear message after 3 seconds
      setCurrentStageIndex(currentStageIndex + 1);
      setLetters(stages[currentStageIndex + 1]?.stage);
    } else if (foundAllCurrentStageWords && currentStageIndex === stages.length - 1) {
      setStageTransitionMessage("Congratulations, you've completed the game!");
    }
  }, [correctWords, currentStageIndex, stages]);

  const handleWordSubmit = () => {
    const currentStage = stages[currentStageIndex];
    if (currentStage && currentStage.words.includes(currentWord.toLowerCase())) {
      setCorrectWords(prev => new Set(prev.add(currentWord.toLowerCase())));
      setCurrentWord('');
      setErrorMessage('');
    } else {
      setErrorMessage("Invalid word. Please try again.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleWordSubmit();
    }
  };

  return (
    <div className="bg-[url('/bg.jpg')] bg-bottom min-h-screen text-white font-extrabold text-2xl p-4 font-serif">
      ProgressBee
      {Array.from(correctWords).length === 0 && (
        <div className='p-[.9rem]'></div>
      )}
      <ul className='mt-8 flex flex-wrap justify-center'>
          {Array.from(correctWords).map((word, index) => (
            <li className='mx-1 text-xl' key={index}>{word}</li> // Display each correct word
          ))}
        </ul>
      <div className="flex flex-col items-center justify-center mt-24">
        <div className='font-semibold text-3xl pb-8'>{letters.toUpperCase().split('').join(' ')}</div>
        <Input
          placeholder='Enter word'
          value={currentWord}
          onChange={(e) => setCurrentWord(e.target.value)}
          onKeyPress={handleKeyPress}
          className="text-white placeholder-white focus:border-green-300"
          width='1/2'
          focusBorderColor='white'
        />
        <Button onClick={handleWordSubmit} colorScheme="green" className='mt-8'>Submit</Button>
        {errorMessage && <div className="mt-8 pt-4 text-amber-400">{errorMessage}</div>}
        {stageTransitionMessage && <div className="text-green-400 pt-4 mt-8 my-4 ">{stageTransitionMessage}</div>}


      </div>
    </div>
  );
}
