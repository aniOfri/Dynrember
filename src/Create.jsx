import './App.css'
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useState, useEffect } from 'react';

function Create(props) {
    const [files, setFiles] = useState([]);
    const [zipContent, setZipContent] = useState({type: "blob"});
    const [numOfImages, setNumOfImages] = useState(0);

    useEffect(() => {
        if (numOfImages >= 5){
            console.log("hello")
            saveAs(zipContent, "test.zip");
        }
    }, [zipContent]);

    const filterDups = (fileList) => {
        let uniqueFiles = [];
        let uniqueNames = [];
        let toAlert = false;
        fileList.forEach((element) => {
            if (!uniqueNames.includes(element.name)) {
                uniqueFiles.push(element);
                uniqueNames.push(element.name);
                console.log(element.name);
            }
            else{
                toAlert = true;
            }
        });
        if (toAlert) alert("One or more files has already been added, that's ok - it's already been deleted.")
        return uniqueFiles;
    }

    const onChangeFile = (e) => {
        let zip = new JSZip();
        let newFiles = filterDups(files.concat(Array.from(e.target.files)));
        setFiles(newFiles);
        setNumOfImages(newFiles.length);
        for (let file = 0; file < newFiles.length; file++) {
            // Zip file with the file name.
            console.log(newFiles[file].name, newFiles[file]);
            zip.file(newFiles[file].name, newFiles[file]);
        }
        zip.generateAsync({type: "blob"}).then(content => {
            setZipContent(content);
        });
    }

    const resetValues = () => {
        setFiles([]);
        setZipContent({type:"blob"});
        setNumOfImages(0);
    }

  return (
    <div>
        <div id="goBack">
            <button onClick={() => props.setPage(0)}>
                Go Back
        </button>
        </div>
        <button onClick={() => {resetValues}}>
                Clear Images
        </button>
        <input multiple type="file" name="file" 
            onChange={onChangeFile}/>
    </div>
  )
}

export default Create
