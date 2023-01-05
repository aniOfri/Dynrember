import './Create.css'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileUploader } from "react-drag-drop-files";
import { useState } from 'react';

function Editor(props) {
  const [files, setFiles] = useState([]);
  const [labels, setLabels] = useState([]);
  const [images, setImages] = useState([]);
  const [matches, setMatches] = useState([]);
  const [numOfImages, setNumOfImages] = useState(0);
  const [loaded, setLoaded] = useState(false);
    // Match Object
    const Match = (id, val, score) =>{
      return {
          id: id,
          label: val,
          score: score
      };
  }

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
                console.log(fileName)
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
                    setMatches(newMatches);
                })
            }
        }
        setNumOfImages(Object.keys(imageSrc).length);
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

  const filterDups = (fileList) => {
    let uniqueFiles = [];
    let toAlert = false;
    fileList.forEach((element) => {
        if (!uniqueFiles.includes(element)) {
            uniqueFiles.push(element);
        }
        else{
            toAlert = true;
        }
    });
    if (toAlert) alert("One or more files has already been added, that's ok - it's already been deleted.")
    return uniqueFiles;
}

  const onChangeFile = (e) => {
    let newFiles = filterDups(files.concat(Array.from(e)));
    setFiles(newFiles);
    setNumOfImages(newFiles.length);
}

const labelSet = (event) => {
  let dict = labels;
  let found = false;
  for (let match = 0; match < labels.length; match++){
      if (dict[match].id == event.target.id){
          dict[match].label = event.target.value;
          found = true;
      }
  }
  if (!found){
      dict.push(Match(event.target.id, event.target.value));
  }

  setLabels(dict);
}

  let previmages = []
  let imagesRow = []
  console.log(Object.keys(images));
  if (numOfImages > 0){
      for (let file = 0; file < Object.keys(images).length; file++){
          if (file % Math.round(files.length/2) == 0 && imagesRow != []){
              previmages.push(<div key={file}>
                              {imagesRow}
                          </div>)
              imagesRow = [];
          }
          imagesRow.push(<div className="preview">
                          <img height="100" width="100px" src={images[file]} /><br></br> 
                          <input id={file} className="TextInput" type="text" onChange={labelSet} />
                      </div>)
      }
      if (imagesRow != []){
          previmages.push(<div>
              {imagesRow}
          </div>)
      }
  }

  let jsx;
  if (loaded){
    jsx = (
      <div className="mainDiv">
          <div id="goBack">
              <button onClick={() => props.setPage(0)}>
                  Go Back
          </button>
          </div>
          <FileUploader className="uploader" handleChange={onChangeFile} multiple types={["PNG", "JPEG", "JPG"]} />
          <br></br>
          <div>
            {previmages}
          </div>

          <button onClick={() => {saveZip()}}>
                  Save
          </button>
      </div>
    )
  }
  else{
    jsx = (<div>
      <input type="file" className="fileBrowse" accept=".dyn"
    onChange={OnLoad}/>
    </div>)
  }
    return (
      jsx
    );
  }

export default Editor