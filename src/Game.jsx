
import { useState } from 'react';
import JSZip from 'jszip';

function Game(props) {
    const [loaded, setLoaded] = useState(false);
    const [images, setImages] = useState([]);
    const [matches, setMatches] = useState([]);

    // Match Object
    const Match = (id, val, score) =>{
        return {
            id: id,
            value: val,
            score: score
        };
    }
    
    let jsx = (<div></div>);
    const OnLoad = (e) =>{
        console.log(e.target.files[0])

        JSZip.loadAsync(e.target.files[0]).then(function (zip) {
            var imageSrc = {};
            for(var i in zip.files){
                console.log(i);
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
                        let matchesStr = text.split("\n");
                        let sliced;
                        let newMatches = []
                        for (let i = 0; i< matchesStr.length; i++){
                            sliced = matchesStr[i].split(',');
                            newMatches.push(Match(sliced[0], sliced[1], sliced[2]));
                        }
                        console.log(newMatches);
                        setMatches(newMatches);
                    })
                }
            }
            setImages(imageSrc);
            console.log(imageSrc);
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

    if (!loaded){
        jsx = (<div>
            <input type="file" className="fileBrowse" accept=".dyn"
        onChange={OnLoad}/>
        </div>)
    }
    else{
        jsx =(<div>

        </div>)
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