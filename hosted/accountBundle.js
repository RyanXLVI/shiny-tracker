const handleUpdate = e => {
  e.preventDefault();
  $("#pikaMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#pass").val == '' || $("#pass2").val == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
  return false;
};

const handlePremium = e => {
  e.preventDefault();
  $("#pikaMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', "/premium", null, redirect);
  return false;
};

const ChangePassWindow = () => {
  return /*#__PURE__*/React.createElement("form", {
    id: "changePassForm",
    name: "changePassForm",
    onSubmit: handleUpdate,
    action: "/account",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "New Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "new password"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass2"
  }, "Retype Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass2",
    type: "password",
    name: "pass2",
    placeholder: "retype password"
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Change Password"
  }));
};

const GoPremiumWindow = () => {
  return /*#__PURE__*/React.createElement("div", {
    id: "premiumInfo"
  }, /*#__PURE__*/React.createElement("h3", null, "Premium gives you a neat feature that you wouldn't have if you are a basic account!"), /*#__PURE__*/React.createElement("h3", null, "FEATURE"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "Ability to track up to 10 hunts at once (Basic is only 5)")), /*#__PURE__*/React.createElement("button", {
    onClick: handlePremium
  }, "GO PREMIUM!"));
};

const createPremiumWindow = () => {
  ReactDOM.render( /*#__PURE__*/React.createElement(GoPremiumWindow, null), document.querySelector("#content"));
};

const createUpdateWindow = () => {
  ReactDOM.render( /*#__PURE__*/React.createElement(ChangePassWindow, null), document.querySelector("#content"));
};

const setup = () => {
  const changePassButton = document.querySelector("#changePassButton");
  const premiumButton = document.querySelector("#premiumButton");
  changePassButton.addEventListener("click", e => {
    e.preventDefault();
    createUpdateWindow();
    return false;
  });
  premiumButton.addEventListener("click", e => {
    e.preventDefault();
    createPremiumWindow();
    return false;
  });
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
