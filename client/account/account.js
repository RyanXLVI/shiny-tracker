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

const handlePremium = (e) => {
    e.preventDefault();

    $("#pikaMessage").animate({width:'hide'}, 350);

    sendAjax('POST', "/premium", null, redirect);
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

const GoPremiumWindow = () => {
    return (
        <div id="premiumInfo">
            <h3>Premium gives you a neat feature that you wouldn't have if you are a basic account!</h3>
            <h3>FEATURE</h3>
            <ul>
                <li>Ability to track up to 10 hunts at once (Basic is only 5)</li>
            </ul>
            <button onClick={handlePremium} id="premiumButton">GO PREMIUM!</button>
        </div>
    );
};

const createPremiumWindow = () => {
    ReactDOM.render(
        <GoPremiumWindow  />,
        document.querySelector("#content")
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
    const premiumButton = document.querySelector("#premiumButton");

    changePassButton.addEventListener("click", (e) => {
        e.preventDefault();
        createUpdateWindow();
        return false;
    });

    premiumButton.addEventListener("click", (e) => {
        e.preventDefault();
        createPremiumWindow();
        return false;
    });
};

$(document).ready(function() {
    setup();
});