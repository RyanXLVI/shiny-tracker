const handleHunt = e => {
  e.preventDefault();
  $("#pikaMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#huntPoke").val() == '' || $("#huntMethod").val() == '' || $("#huntEncounters").val() == '' || $("#huntGeneration").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#huntForm").attr("action"), $("#huntForm").serialize(), function () {
    loadHuntsFromServer();
  });
  return false;
};

const updateHunt = (e, huntID) => {
  e.preventDefault();
  sendAjax('POST', $(`#finishForm${huntID}`).attr("action"), $(`#finishForm${huntID}`).serialize(), function () {
    loadHuntsFromServer();
  });
  return false;
};

const HuntForm = () => {
  return /*#__PURE__*/React.createElement("form", {
    id: "huntForm",
    onSubmit: handleHunt,
    name: "huntForm",
    action: "/tracker",
    method: "POST",
    className: "huntForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pokemon"
  }, "Pokemon: "), /*#__PURE__*/React.createElement("input", {
    id: "huntPoke",
    type: "text",
    name: "pokemon",
    placeholder: "Pokemon"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "method"
  }, "Shiny Hunt Method: "), /*#__PURE__*/React.createElement("input", {
    id: "huntMethod",
    type: "text",
    name: "method",
    placeholder: "Method"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "encounters"
  }, "Encounters: "), /*#__PURE__*/React.createElement("input", {
    id: "huntEncounters",
    type: "text",
    name: "encounters",
    placeholder: "0"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "generation"
  }, "Generation: "), /*#__PURE__*/React.createElement("input", {
    id: "huntGeneration",
    type: "text",
    name: "generation",
    placeholder: "2"
  }), /*#__PURE__*/React.createElement("input", {
    className: "trackHuntSubmit",
    type: "submit",
    value: "Track Hunt"
  }));
};

const HuntList = function (props) {
  if (props.hunts.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "huntList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyHunt"
    }, "No hunts yet"));
  }

  const huntNodes = props.hunts.map(function (hunt) {
    return /*#__PURE__*/React.createElement("div", {
      key: hunt._id,
      className: "hunt"
    }, /*#__PURE__*/React.createElement("img", {
      src: `https://img.pokemondb.net/sprites/home/shiny/${hunt.pokemon.toLowerCase()}.png`,
      alt: `${hunt.pokemon}`
    }), /*#__PURE__*/React.createElement("h3", {
      className: "huntPoke"
    }, "Pokemon: ", hunt.pokemon), /*#__PURE__*/React.createElement("h3", {
      className: "huntMethod"
    }, "Method: ", hunt.method), /*#__PURE__*/React.createElement("h3", {
      className: "huntEncounters"
    }, "Encounters: ", hunt.encounters), /*#__PURE__*/React.createElement("h3", {
      className: "huntGeneration"
    }, "Generation: ", hunt.generation), /*#__PURE__*/React.createElement("form", {
      id: `finishForm${hunt.pokemon}`,
      onSubmit: e => updateHunt(e, hunt.pokemon),
      name: hunt.pokemon,
      action: "/finish",
      method: "POST",
      className: "finishForm"
    }, /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "pokemon",
      value: hunt.pokemon
    }), /*#__PURE__*/React.createElement("input", {
      className: "finishSubmit",
      type: "submit",
      value: "Finish"
    })));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "huntList"
  }, huntNodes);
};

const loadHuntsFromServer = () => {
  sendAjax('GET', '/getHunts', null, data => {
    ReactDOM.render( /*#__PURE__*/React.createElement(HuntList, {
      hunts: data.hunts
    }), document.querySelector("#hunts"));
  });
};

const setup = function () {
  ReactDOM.render( /*#__PURE__*/React.createElement(HuntForm, null), document.querySelector("#trackHunt"));
  ReactDOM.render( /*#__PURE__*/React.createElement(HuntList, {
    hunts: []
  }), document.querySelector("#hunts"));
  loadHuntsFromServer();
};

$(document).ready(function () {
  setup();
});
const handleError = message => {
  $("#errorMessage").text(message);
  $("#pikaMessage").animate({
    width: 'toggle'
  }, 350);
};

const redirect = response => {
  $("pikaMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function (xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
