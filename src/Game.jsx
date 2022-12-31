
import { useState } from 'react';
import JSZip from 'jszip';
import './Create.css';

function Game(props) {
    const [loaded, setLoaded] = useState(false);
    const [images, setImages] = useState([]);
    const [matches, setMatches] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(0);
    const [round, setRound] = useState(0);
    const [lastAnswer, setLastAnswer] = useState("");

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

    const handleAnswer = (e) =>{
        let id = e.target.name;
        let tempMatches = matches;

        if (currentMatch == id){
            tempMatches[currentMatch].score+=1
            setLastAnswer("Correct!");
            
        }
        else{
            tempMatches[currentMatch].score-=1
            setLastAnswer("Wrong!");
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

        console.log(matches)
        
        setCurrentMatch(lowestScoreId);
        setRound(round+1)
    }

    if (!loaded){
        jsx = (<div>
            <input type="file" className="fileBrowse" accept=".dyn"
        onChange={OnLoad}/>
        </div>)
    }
    else{
        let previewImages = [];
        if (matches.length > 0){
            let selected = [];
            do 
            {
                let shuffled = [];
                for (let i = 0; i < Object.keys(matches).length; i++)
                    shuffled.push(i);
                shuffled = shuffled.sort(() => 0.5 - Math.random());
                selected = shuffled.slice(0, 3);
                if (!selected.includes(currentMatch))
                    selected[Math.floor(Math.random()*3)] = parseInt(currentMatch);
            }
            while (hasDuplicates(selected));

            for (let j in selected){
                let i = selected[j];
                previewImages.push(<div key={i} className="preview">
                    <img name={matches[i].id} height="100" width="100px" src={images[i]} onClick={handleAnswer} /><br></br>
                </div>)
            }

            jsx =(<div>
                <h1>{matches[currentMatch].label}</h1>
                {previewImages}
                <p>{lastAnswer}</p>
            </div>)
        }
        else{
            jsx = (<div></div>)
        }
    }

    function hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }
    
    return (
    <div>
        <div id="goBack">
            <button onClick={() => props.setPage(0)}>
                Go Back
        </button>
        </div>
        {jsx}
    </div>
    )
}

export default Game