import { useSpeechSynthesis } from "react-speech-kit";

const Speech = (props) => {
  const { speak } = useSpeechSynthesis();

  return (
    <div className="speech">
    <button onClick={() => speak({ text: props.value })}>הפעל קול</button>
    </div>
  );
};
export default Speech;