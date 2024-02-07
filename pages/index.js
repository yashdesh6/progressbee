import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import GamePage with SSR disabled
const GamePageNoSSR = dynamic(() => import('../components/GamePage'), {
  ssr: false, // This disables server-side rendering for GamePage
});

export default function Home() {
  return (

    <GamePageNoSSR /> 
    
  );
}
