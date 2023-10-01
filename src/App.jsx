import { useState, useEffect, useRef } from 'react'
import './App.css'
import SingleCard from './components/SingleCard'
import { cardImages } from './components/cardImages'
import correctMatchSound from './assets/mixkit-dumbbell-pins-at-the-gym-2102.wav'
import incorrectMatchSound from './assets/mixkit-negative-tone-interface-tap-2569.wav';


function App() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const correctMatchSoundRef = useRef(null);
  const incorrectMatchSoundRef = useRef(null);


  // shuffle cards for new game
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, id: Math.random() }))

    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
  }

  // handle a choice
  const handleChoice = (card) => {
    console.log(card)
    correctMatchSoundRef.current = new Audio(correctMatchSound);
    incorrectMatchSoundRef.current = new Audio(incorrectMatchSound);
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  // compare 2 selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true)

      if (choiceOne.src === choiceTwo.src) {
        console.log('they match')
        correctMatchSoundRef.current.play();
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        console.log('they do not match')
        incorrectMatchSoundRef.current.play();
        setTimeout(() => resetTurn(), 1000)
      }

    }
  }, [choiceOne, choiceTwo])

  console.log(cards)
  const isGameOver = () => {
    return cards.every(card => card.matched);
  };

  // reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  useEffect(() => {
    shuffleCards()
  }, [])


  return (
    <div className="App">
      <h1>Xpert Match</h1>
      {isGameOver() && <p>Game Over! You've matched all the cards.</p>}
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map(card => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>


    </div>
  );
}

export default App
