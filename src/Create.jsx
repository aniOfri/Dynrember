import './Create.css'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useState } from 'react';

function Create(props) {
    const [files, setFiles] = useState([]);
    const [labels, setLabels] = useState([]);
    const [numOfImages, setNumOfImages] = useState(0);

    // Match Object
    const Match = (id, val) =>{
        return {
            id: id,
            label: val,
            score: 0
        };
    }
    
    function hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    function hasNoEmpty(array) {
        return Array.from(new Set(array)).map(a => a.replace(/\s/g, "")).includes("") || labels.length != numOfImages;
    }

    // Save file as session
    const saveZip = async () =>{
        console.log(labels)
        if (numOfImages >= 5 && !hasNoEmpty(labels.map(a => a.label)) && !hasDuplicates(labels.map(a => a.label))){
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
        for (let match = 0; match < labels.length; match++){
            txt += labels[match].id +","+labels[match].label+","+labels[match].score+"\n"
        }

        var fileTxt = new File([txt], "score.txt", {type: "text/plain;charset=utf-8"});
        zip.file("score.txt", fileTxt);

        zip.generateAsync({type: "blob"}).then(content => {
            saveAs(content, "test.dyn");
        });
    }

    
    const filterDups = (fileList) => {
        let uniqueFiles = [];
        let uniqueNames = [];
        let toAlert = false;
        fileList.forEach((element) => {
            if (!uniqueNames.includes(element.name)) {
                uniqueFiles.push(element);
                uniqueNames.push(element.name);
            }
            else{
                toAlert = true;
            }
        });
        if (toAlert) alert("One or more files has already been added, that's ok - it's already been deleted.")
        return uniqueFiles;
    }

    const onChangeFile = (e) => {
        let newFiles = filterDups(files.concat(Array.from(e.target.files)));
        setFiles(newFiles);
        setNumOfImages(newFiles.length);
    }

    const resetValues = () => {
        setFiles([]);
        setNumOfImages(0);
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
    

    let images = []
    let imagesRow = []
    if (numOfImages > 0){
        for (let file = 0; file < files.length; file++){
            if (file % Math.round(files.length/2) == 0){
                images.push(<div key={file} >
                                {imagesRow}
                            </div>)
                imagesRow = [];
            }
            imagesRow.push(<div className="preview">
                            <img height="100" width="100px" src={URL.createObjectURL(files[file])} /><br></br> 
                            <input id={file} className="TextInput" type="text" onChange={labelSet} />
                        </div>)
        }
        if (imagesRow != []){
            images.push(<div>
                {imagesRow}
            </div>)
        }
    }

  return (
    <div className="mainDiv">
        <div id="goBack">
            <button onClick={() => props.setPage(0)}>
                Go Back
        </button>
        </div>
        <button onClick={() => {resetValues()}}>
                Clear Images
        </button><br/>

        <input multiple type="file" className="fileBrowse" accept="image/*"
            onChange={onChangeFile}/><br></br>
        
        {images} <br></br>
        {labels}

        <button onClick={() => {saveZip()}}>
                Save
        </button>
    </div>
  )
}

export default Create
