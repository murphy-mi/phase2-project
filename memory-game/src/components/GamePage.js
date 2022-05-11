import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import { imgArr } from '../data.js'
import HighScores from './HighScores';
import Settings from './Settings';
import GamePlayer from './GamePlayer';

function GamePage() {

    // STATE
    const [imagesArray, setImagesArray] = useState([])
    const [cardsChosen, setCardsChosen] = useState([])
    const [cardsChosenIdx, setCardsChosenIdx] = useState([])
    const [points, setPoints] = useState(0)
    const [openCards, setOpenCards] = useState([])
    const [playCount, setPlayCount] = useState(0)
    const [playTimer, setPlayTimer] = useState(0)
    const [guessCount, setGuessCount] = useState(0)
    const [intervalId, setIntervalId] = useState("")

    useEffect(() => {
        createCardBoard()
    }, [playCount])

    useEffect(() => {
        createCardBoard()
        
    }, [])

    useEffect(() => {
        console.log(playTimer)
        console.log(intervalId)
        if(points < 16 && guessCount === 1) {
             setIntervalId(setInterval(() => setPlayTimer(playTimer => playTimer + 1), 1000))
        } else if(points === 16) {
            console.log(intervalId)
            clearInterval(intervalId)
        }
    }, [guessCount])
    
    // INITIALIZE ON RENDER
    function createCardBoard() {
        const imagesGenerated = imgArr.concat(...imgArr) // double our images
        const shuffledArray = shuffleArray(imagesGenerated)
        setImagesArray(shuffledArray)
    }

     // ON IMAGE CLICK
    function handleFlip(image, index) {

        setGuessCount(guessCount => guessCount + 1)
        
        if (cardsChosenIdx.length === 1 && cardsChosenIdx[0] === index) {
            return
        }

        if (cardsChosen.length < 2) {
            setCardsChosen(cardsChosen => cardsChosen.concat(image))
            setCardsChosenIdx(cardsChosenIdx => cardsChosenIdx.concat(index))

            if (cardsChosen.length === 1) {
                if (cardsChosen[0] === image) {
                    setPoints(points => points + 2)
                    setOpenCards(openCards => openCards.concat([cardsChosen[0], image]))
                }
                setTimeout(() => {
                    setCardsChosenIdx([])
                    setCardsChosen([])
                }, 700)
            }
        }
    }

    function isCardChosen(image, index) {
        return cardsChosenIdx.includes(index) || openCards.includes(image)
    }

    function shuffleArray(array) {
        for (let i = 0; i < array.length; i++) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    function playAgain() {
        setCardsChosenIdx([])
        setCardsChosen([])
        setPoints(0)
        setOpenCards([])
        setPlayTimer(0)
        setPlayCount(playCount => playCount + 1)
    }


    return (
        <div className="GamePage">
            <Routes>
                <Route
                    path="/"
                    element={
                        <GamePlayer
                            playAgain={playAgain}
                            imagesArray={imagesArray}
                            handleFlip={handleFlip}
                            points={points}
                            isCardChosen={isCardChosen}
                            playTimer={playTimer}
                        />
                    }
                />
                <Route
                    path="/highscores"
                    element={<HighScores />}
                />
                <Route
                    path="/settings"
                    element={<Settings />}
                />
            </Routes>
        </div>
    );
}

export default GamePage;