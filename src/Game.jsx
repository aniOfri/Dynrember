
import { useState } from 'react';
import JSZip from 'jszip';

function Game(props) {
    const [loaded, setLoaded] = useState(false);
    const [files, setFiles] = useState([]);

    let jsx = (<div></div>);
    const OnLoad = (e) =>{
        console.log(e.target.files[0])

        JSZip.loadAsync(e.target.files[0]).then(function (zip) {
            var imageSrc = {};
            for(var i in zip.files){
                console.log(i);
                var fileName = zip.files[i];
                var buffer = fileName._data.compressedContent,
                str = _arrayBufferToBase64(buffer),
                pIndex = i.indexOf('.'),
                type = i.substring(pIndex + 1),
                res = 'data:image/' + type + ';base64,';
                imageSrc[i.slice(0, i.indexOf('.'))] = res + str;
            }
            setFiles(imageSrc);
            console.log(imageSrc[0]);
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