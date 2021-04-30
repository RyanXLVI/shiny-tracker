const handleHunt = (e) => {
    e.preventDefault();

    $("#pikaMessage").animate({width:'hide'}, 350);

    if($("#huntPoke").val() == '' || $("#huntMethod").val() == '' || $("#huntEncounters").val() == '' || $("#huntGeneration").val() == ''){
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#huntForm").attr("action"), $("#huntForm").serialize(), function() {
        loadHuntsFromServer();
    });

    return false;
};

const updateHunt = (e, huntID) => {
    e.preventDefault();
    
    sendAjax('POST', $(`#finishForm${huntID}`).attr("action"), $(`#finishForm${huntID}`).serialize(), function() {
        loadHuntsFromServer();
    });

    return false;
};

const HuntForm = () => {
    return (
        <form id="huntForm"
            onSubmit={handleHunt}
            name="huntForm"
            action="/tracker"
            method="POST"
            className="huntForm"
        >
            <label htmlFor="pokemon">Pokemon: </label>
            <input id="huntPoke" type="text" name="pokemon" placeholder="Pokemon"/>
            <label htmlFor="method">Shiny Hunt Method: </label>
            <input id="huntMethod" type="text" name="method" placeholder="Method"/>
            <label htmlFor="encounters">Encounters: </label>
            <input id="huntEncounters" type="text" name="encounters" placeholder="0"/>
            <label htmlFor="generation">Generation: </label>
            <input id="huntGeneration" type="text" name="generation" placeholder="2"/>
            <input className="trackHuntSubmit" type="submit" value="Track Hunt"/>
        </form>
    );
};

const HuntList = function(props) {
    if(props.hunts.length === 0) {
        return (
            <div className="huntList">
                <h3 className="emptyHunt">No hunts yet</h3>
            </div>
        );
    }

    const huntNodes = props.hunts.map(function(hunt) {
        return (
            <div key={hunt._id} className="hunt">
                <img src={`https://img.pokemondb.net/sprites/home/shiny/${hunt.pokemon.toLowerCase()}.png`} alt={`${hunt.pokemon}`}/>
                <h3 className="huntPoke">Pokemon: {hunt.pokemon}</h3>
                <h3 className="huntMethod">Method: {hunt.method}</h3>
                <h3 className="huntEncounters">Encounters: {hunt.encounters}</h3>
                <h3 className="huntGeneration">Generation: {hunt.generation}</h3>
                <form id={`finishForm${hunt.pokemon}`}
                    onSubmit={(e) => updateHunt(e, hunt.pokemon)}
                    name={hunt.pokemon}
                    action="/finish"
                    method="POST"
                    className="finishForm"
                >
                    <input type="hidden" name="pokemon" value={hunt.pokemon}/>
                    <input className="finishSubmit" type="submit" value="Finish"/>
                </form>
            </div>
        );
    });

    return (
        <div className="huntList">
            {huntNodes}
        </div>
    );
};

const loadHuntsFromServer = () => {
    sendAjax('GET', '/getHunts', null, (data) => {
        ReactDOM.render(
            <HuntList hunts={data.hunts} />, document.querySelector("#hunts")
        );
    });
};

const setup = function() {
    ReactDOM.render(
        <HuntForm/>, document.querySelector("#trackHunt")
    );

    ReactDOM.render(
        <HuntList hunts={[]}/>, document.querySelector("#hunts")
    );

    loadHuntsFromServer();
};

$(document).ready(function() {
    setup();
});