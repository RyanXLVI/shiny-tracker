const handleUpdate = (e) => {
    e.preventDefault();

    $("#pikaMessage").animate({width:'hide'}, 350);

    if($("#pass").val == '' || $("#pass2").val == ''){
        handleError("All fields are required");
        return false;
    }

    if($("#pass").val() !== $("#pass2").val()){
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#changePassForm").attr("action"), $("#changePassForm").serialize(), redirect);
    return false;
};

const ChangePassWindow = () => {
    return (
        <form id="changePassForm" name="changePassForm"
                onSubmit={handleUpdate}
                action="/account"
                method="POST"
                className="mainForm"
            >
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="new password"/>
            <label htmlFor="pass2">Retype Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
            <input className="formSubmit" type="submit" value="Change Password"/>
        </form>
    );
};

const createUpdateWindow = () => {
    ReactDOM.render(
        <ChangePassWindow  />,
        document.querySelector("#content")
    );
};

const setup = () => {
    const changePassButton = document.querySelector("#changePassButton");

    changePassButton.addEventListener("click", (e) => {
        e.preventDefault();
        createUpdateWindow();
        return false;
    });
};

$(document).ready(function() {
    setup();
});