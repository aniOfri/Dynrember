import './Create.css'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FileUploader } from "react-drag-drop-files";
import { useState } from 'react';

function Editor(props) {
  const [files, setFiles] = useState([]);
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
        let filesCounter = 0;
        let tempFiles = []
        for(var i in zip.files){
            let pIndex = i.indexOf('.'),
            type = i.substring(pIndex + 1);
            if (type != "txt"){
                filesCounter += 1;
                var fileName = zip.files[i];
                var bufferValue = fileName._data.compressedContent;
                let finblob = new Blob([bufferValue], {
                  type: 'image/'+type
                });
                const FinalFile = new File([finblob], fileName.name, finblob)
                tempFiles.push(FinalFile);
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
        concatToFiles(tempFiles);
        setNumOfImages(filesCounter);
      });
    setLoaded(true);
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
    concatToFiles(Array.from(e))
}

const concatToFiles = (filesArray) =>{
  let newFiles = filterDups(files.concat(filesArray)),
  newMatches = matches;

  newMatches.push(Match(matches.length, "", 0));

  setMatches(newMatches);
  setFiles(newFiles);
  setNumOfImages(newFiles.length);
}

    function hasDuplicates(array) {
      return (new Set(array)).size !== array.length;
    }

    function hasNoEmpty(array) {
      return Array.from(new Set(array)).map(a => a.replace(/\s/g, "")).includes("") || matches.length != numOfImages;
    }

    // Save file as session
    const saveZip = async () =>{
      if (numOfImages >= 5 && !hasNoEmpty(matches.map(a => a.label)) && !hasDuplicates(matches.map(a => a.label))){
          zipper()
      }
      else{
          if (numOfImages < 5){
              alert("There are less than 5 images.");
          }
          else if (hasNoEmpty(labels.map(a => a.label))){
              alert("Not every images is labeled.");
          }
          else{
              alert("One or more of the labels are duplicated or empty");
          }
      }
  }

  const zipper = () => {
      let zip = new JSZip();
      for (let file = 0; file < files.length; file++) {
          zip.file(file+".png", files[file]);
      }

      let txt = "";
      for (let match = 0; match < matches.length; match++){
          txt += matches[match].id +","+matches[match].label+","+matches[match].score+"\n"
      }

      var fileTxt = new File([txt], "score.txt", {type: "text/plain;charset=utf-8"});
      zip.file("score.txt", fileTxt);

      zip.generateAsync({type: "blob"}).then(content => {
          saveAs(content, "test.dyn");
      });
  }

const labelSet = (event) => {
  let dict = matches;
  let found = false;
  for (let match = 0; match < matches.length; match++){
      if (dict[match].id == event.target.id){
          dict[match].label = event.target.value;
          found = true;
      }
  }
  if (!found){
      dict.push(Match(event.target.id, event.target.value));
  }
  setMatches(dict)
}

const HandleRemove = (e) =>{
  let tempFiles = files;
  let tempMatches = matches;
  tempFiles.splice(e.target.name, 1);
  setFiles(tempFiles);
  setNumOfImages(numOfImages-1);
  try{
      tempMatches.splice(e.target.name,1)
      for (let i = 0; i< tempMatches.length; i++){
        tempMatches[i].id = i;
      }
      setMatches(tempMatches)
  }catch (error) {
      console.error(error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // (Note: the exact output may be browser-dependent)
    }
}

let previmages = []
let imagesRow = []
  try {
  if (numOfImages > 0){
      for (let file = 0; file < files.length; file++){
          if (imagesRow.length % Math.floor(files.length/2) == 0 && imagesRow != []){
                previmages.push(<div>
                                {imagesRow}
                            </div>)
              imagesRow = [];
          }
          imagesRow.push(<div key={imagesRow.length} className="preview">
                          <button name={file} onClick={HandleRemove}>מחק</button><br></br>
                          <img height="100" width="100px" src={URL.createObjectURL(files[file])} /><br></br> 
                          <input id={file} className="TextInput" defaultValue={matches[file].label} type="text" onChange={labelSet} />
                      </div>)
      }
      if (imagesRow != []){
          if (imagesRow.length < 3){
            previmages[previmages.length-1] = (<div>
                {previmages[previmages.length-1].props.children}
                {imagesRow}
            </div>)
          }
          else{
            previmages.push(<div>
              {imagesRow}
            </div>)
          }
      }
  }
  }
  catch(e){
  }

  let jsx;
  if (loaded){
    jsx = (
      <div className="mainDiv">
          <div id="goBack">
              <button onClick={() => props.setPage(0)}>
                  חזור אחורה
          </button>
          </div>
          <FileUploader className="uploader" handleChange={onChangeFile} multiple types={["PNG", "JPEG", "JPG"]} />
          <br></br>
          <div>
            {previmages}
          </div>

          <button onClick={() => {saveZip()}}>
                  שמור קובץ
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