
import { useState } from 'react';
import JSZip from 'jszip';
import Speech from './Speech';
import './Game.css';
import useSound from 'use-sound';
import Confetti from 'react-confetti'
import correct from './correct.mp3';
import correct2 from './correct2.mp3';
import incorrect from './incorrect.mp3';

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  
function Game() {
    const dims = getWindowDimensions();
    const [correctPlay] = useSound(correct);
    const [correctPlay2] = useSound(correct2);
    const [incorrectPlay] = useSound(incorrect);
    const [loaded, setLoaded] = useState(false);
    const [images, setImages] = useState([]);
    const [matches, setMatches] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(0);
    const [round, setRound] = useState(0);
    const [lastAnswer, setLastAnswer] = useState("");
    const [wrongAnswers, SetWrongAnswers] = useState(0);
    const [correctAnswers, SetCorrectAnswers] = useState(0);
    const [mode, setMode] = useState(2);

    // Match Object
    const Match = (id, val, score) =>{
        return {
            id: id,
            label: val,
            score: score
        };
    }
    
    let jsx = (<div></div>);
    const OnLoad = (e) =>{
        JSZip.loadAsync(e.target.files[0]).then(function (zip) {
            var imageSrc = {};
            for(var i in zip.files){
                let pIndex = i.indexOf('.'),
                type = i.substring(pIndex + 1);
                if (type != "txt"){
                    var fileName = zip.files[i];
                    var bufferValue = fileName._data.compressedContent,
                    str = _arrayBufferToBase64(bufferValue);
                    let res = 'data:image/' + type + ';base64,';
                    imageSrc[i.slice(0, i.indexOf('.'))] = res + str;
                }
                else{
                    zip.files[i].async("string").then((text) => {
                        let matchesStr = text.split("\n"),
                        sliced,
                        newMatches = [],
                        lowestScore = 0,
                        lowestScoreId = 0;
                        for (let i = 0; i< matchesStr.length-1; i++){
                            sliced = matchesStr[i].split(',');
                            newMatches.push(Match(parseInt(sliced[0]), sliced[1], parseInt(sliced[2])));

                            if (lowestScore > sliced[2]){
                                lowestScoreId = sliced[0];
                            }
                        }
                        setCurrentMatch(lowestScoreId);
                        setMatches(newMatches);
                    })
                }
            }
            setImages(imageSrc);
          });
        setLoaded(true);
    }

    function _arrayBufferToBase64( buffer ) {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[i] );
        }
        return window.btoa( binary );
    }

    // Image Matching Mode
    const handleAnswerIMM = (e) =>{
        let id = e.target.name;
        let tempMatches = matches;

        if (currentMatch == id){
            tempMatches[currentMatch].score+=1
            setLastAnswer("תשובה נכונה!");
            SetCorrectAnswers(correctAnswers+1)
            
        }
        else{
            tempMatches[currentMatch].score-=1
            setLastAnswer("טעות!");
            SetWrongAnswers(wrongAnswers+1)
        }
        
        nextRound();
        setMatches(tempMatches);
    }

    const handleAnswerITM = (e) =>{
        let id = e.target.id;
        let tempMatches = matches;

        if (currentMatch == id){
            tempMatches[currentMatch].score+=1
            setLastAnswer("תשובה נכונה!");
            SetCorrectAnswers(correctAnswers+1)
            
        }
        else{
            tempMatches[currentMatch].score-=1
            setLastAnswer("טעות!");
            SetWrongAnswers(wrongAnswers+1)
        }
        
        nextRound();
        setMatches(tempMatches);
    }
    
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleAnswerIWM(event.target.value);
        }
      };

    const handleAnswerIWM = (value) =>{
        let tempMatches = matches;

        if (value.toLowerCase() == matches[currentMatch].label.toLowerCase()){
            tempMatches[currentMatch].score+=1
            setLastAnswer("תשובה נכונה!");
            SetCorrectAnswers(correctAnswers+1)
        }
        else{
            tempMatches[currentMatch].score-=1
            setLastAnswer("טעות!");
            SetWrongAnswers(wrongAnswers+1)
        }
        
        nextRound();
        setMatches(tempMatches);
    }


    const nextRound = () =>{
        let allScores = [];
        for (let i = 0; i < matches.length; i++)
            allScores.push(matches[i].score);
        let lowestScore = Math.min(...allScores),
        lowestScoreId = 0;

        for (let i = 0; i < matches.length; i++){
            if (lowestScore >= matches[i].score && parseInt(matches[i].id) != parseInt(currentMatch)){
                lowestScoreId = matches[i].id;
            }
        }

        setCurrentMatch(lowestScoreId);
        setRound(round+1);
        
        let newMode;
        do newMode = (Math.floor(Math.random()*4));
        while (newMode == mode)
        setMode(newMode);
    }



    const GetRandomMatch = () => {
        let selected = [];
        do 
        {
            let shuffled = [];
            for (let i = 0; i < Object.keys(matches).length; i++)
                shuffled.push(i);
            shuffled = shuffled.sort(() => 0.5 - Math.random());
            selected = shuffled.slice(0, Math.min(5,matches.length));
            if (!selected.includes(currentMatch))
                selected[Math.floor(Math.random()*Math.min(5,matches.length))] = parseInt(currentMatch);
        }
        while (hasDuplicates(selected));
        return selected;
    }

    if (!loaded){
        jsx = (<div>
            <input type="file" className="fileBrowse" accept=".dyn"
        onChange={OnLoad}/>
        </div>)
    }
    else{
        let confetti = "";
        if (lastAnswer == "תשובה נכונה!"){
            if (correctAnswers % 5 == 0){
                correctPlay2()
                confetti = (    
                    <Confetti
                    width={dims.innerWidth}
                    height={dims.innerHeight}
                    recycle={false}
                  />)
                }
            else{
            correctPlay()
            }
        }
        else{
            if (wrongAnswers >= 1){
                incorrectPlay()
            }
        }

        // MODE 0 - Image Matching Mode
        if (mode == 0){
            if (matches.length > 0){
                let viewImages = [];
                let selected = GetRandomMatch();

                for (let j in selected){
                    let i = selected[j];
                    viewImages.push(<div key={i} className="preview">
                        <img name={matches[i].id} height="100" width="100px" src={images[i]} onClick={handleAnswerIMM} /><br></br>
                    </div>)
                }


                jsx =(<div>
                    <h1>טעויות: {wrongAnswers} |  :תשובות נכונות {correctAnswers}</h1>
                    <h1>{matches[currentMatch].label}</h1>
                    {viewImages}
                    <p>{lastAnswer} {confetti}</p>
                </div>)
            }
            else{
                jsx = (<div></div>)
            }
        }
        // MODE 1 - Text Matching Mode
        else if (mode == 1){
            if (matches.length > 0){
                let viewText = [];
                let selected = GetRandomMatch();
                for (let j in selected){
                    let i = matches[selected[j]];
                    viewText.push(<div key={i.id} className="preview">
                        <button className="buttonText" id={i.id} onClick={handleAnswerITM} >{i.label}</button><br></br>
                    </div>)
                }
                jsx =(<div>
                    <h1>טעויות: {wrongAnswers} |  :תשובות נכונות {correctAnswers}</h1>
                    <img height="100" width="100px" src={images[matches[currentMatch].id]}/><br></br>
                    {viewText}
                    <p>{lastAnswer} {confetti}</p>
                </div>)

            }
            else{
                jsx = (<div></div>)
            }
        }
        // MODE 2 - Image Writing Mode
        else if (mode == 2){
            if (matches.length > 0){
                jsx =(<div>
                    <h1>טעויות: {wrongAnswers} |  :תשובות נכונות {correctAnswers}</h1>
                    <img height="100" width="100px" src={images[matches[currentMatch].id]}/><br></br>
                    <input type="text" defaultValue="" onKeyDown={handleKeyDown}/>
                    
                    <p>{lastAnswer} {confetti}</p>
                </div>)

            }
            else{
                jsx = (<div></div>)
            }
        }
        else{
            if (matches.length > 0){
                let viewImages = [];
                let selected = GetRandomMatch();

                for (let j in selected){
                    let i = selected[j];
                    viewImages.push(<div key={i} className="preview">
                        <img name={matches[i].id} height="100" width="100px" src={images[i]} onClick={handleAnswerIMM} /><br></br>
                    </div>)
                }

                jsx =(<div>
                    <h1>טעויות: {wrongAnswers} |  :תשובות נכונות {correctAnswers}</h1>
                    <Speech value={matches[currentMatch].label}/><br/>
                    {viewImages}
                    <p>{lastAnswer} {confetti}</p>
                </div>)
            }
            else{
                jsx = (<div></div>)
            }
        }
    }
    function hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }
    
    return (
    <div>
        {jsx}
    </div>
    )
}

export default Game