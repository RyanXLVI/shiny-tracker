const handleLogin = e => {
  e.preventDefault();
  $("#pikaMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val == '') {
    handleError("Username or password is empty");
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
};

const handleSignup = e => {
  e.preventDefault();
  $("#pikaMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val == '' || $("#pass2").val == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

const LoginWindow = props => {
  return /*#__PURE__*/React.createElement("form", {
    id: "loginForm",
    name: "loginForm",
    onSubmit: handleLogin,
    action: "/login",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
  }), /*#__PURE__*/React.createElement("input", {
    className: "formSubmit",
    type: "submit",
    value: "Sign in"
  }));
};

const SignupWindow = () => {
  return /*#__PURE__*/React.createElement("form", {
    id: "signupForm",
    name: "signupForm",
    onSubmit: handleSignup,
    action: "/signup",
    method: "POST",
    className: "mainForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "username"
  }, "Username: "), /*#__PURE__*/React.createElement("input", {
    id: "user",
    type: "text",
    name: "username",
    placeholder: "username"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "pass"
  }, "Password: "), /*#__PURE__*/React.createElement("input", {
    id: "pass",
    type: "password",
    name: "pass",
    placeholder: "password"
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
    value: "Sign Up"
  }));
};

const createLoginWindow = () => {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, null), document.querySelector("#content"));
};

const createSignupWindow = () => {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, null), document.querySelector("#content"));
};

const setup = () => {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");
  signupButton.addEventListener("click", e => {
    e.preventDefault();
    createSignupWindow();
    return false;
  });
  loginButton.addEventListener("click", e => {
    e.preventDefault();
    createLoginWindow();
    return false;
  });
  createLoginWindow();
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
