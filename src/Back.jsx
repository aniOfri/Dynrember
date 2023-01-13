

function Back(props) {
  return (
    <div id="goBack">
        <button onClick={() => props.setPage(0)}>
            חזור אחורה
        </button>
    </div>
  )
}

export default Back
