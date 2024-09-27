//Login logic with post request, succesful login or token present => will be redirected to main.html.
function login() {
    let token = localStorage.getItem('token');

    //if tokent dsnt exist it will post to backend, else redirect to main.html
    if (token == undefined || token == null || token == "") {
        const login = document.getElementById('form');
        const email = document.getElementById('email');
        const password = document.getElementById('password');

        login.addEventListener('submit', async (e) => {
            addLoading();
            e.preventDefault();
            
            const credentials = btoa(`${email.value}:${password.value}`);
            
            const response = await fetch('http://localhost:8080/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${credentials}`
                }
            });

            let token = await response.json();

            if (token.error) {
                removeLoading();
                let err = document.getElementById('err');
                err.innerHTML = token.error;
                err.style.display = 'block';
                setTimeout(() => {
                    err.style.display = 'none';
                }, 3000);
            } else {
                removeLoading();
                localStorage.setItem('token', token.token);
                window.location.href = 'main.html';
            }
        });
    } else {
        window.location.href = 'main.html';
    }
}

//inits page
document.addEventListener('DOMContentLoaded', function() {
    addLoading();
    createForm();
    login();

 });

//Creates innerHTML
function createForm(){

    
    let container = document.createElement('div');
    container.classList.add('container');
    document.body.appendChild(container);

    let form = document.createElement('form');
    form.classList.add('login-container');
    form.id = 'form';
    container.appendChild(form);

    let title = document.createElement('h1');
    title.id = 'loginTitle';
    title.innerText = 'Login';
    form.appendChild(title);

    let subtitle = document.createElement('h5');
    subtitle.innerHTML = '<i>Username: test passwd: test</i>';
    form.appendChild(subtitle);

    let emailInput = document.createElement('input');
    emailInput.classList.add('input');
    emailInput.id = 'email';
    emailInput.placeholder = 'Username/email';
    emailInput.name = 'email';
    emailInput.required = true;
    form.appendChild(emailInput);

    let passwordInput = document.createElement('input');
    passwordInput.classList.add('input');
    passwordInput.id = 'password';
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Password';
    passwordInput.name = 'password';
    passwordInput.required = true;
    form.appendChild(passwordInput);

    let errorLabel = document.createElement('label');
    errorLabel.id = 'err';
    errorLabel.innerText = 'Invalid credentials';
    errorLabel.style.display = 'none';  
    form.appendChild(errorLabel);

    let submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.id = 'submit';
    submitButton.value = 'Log In';
    form.appendChild(submitButton);
    
}

//Ends animation started at DomContentLoaded
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");

    if (loader) {
        loader.classList.add("loader--hidden");

        loader.addEventListener("transitionend", () => {
            if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        });
    }
});

//TODO:Eraldi fail addLoadingu ja removeLoadingu jaoks
function addLoading() {
    console.log("We are waiting...");

    let loader = document.querySelector('.loader');
    
    if (!loader) {
        loader = document.createElement('div');
        loader.classList.add('loader');
        document.body.appendChild(loader);
    } else {
        loader.classList.remove('loader--hidden');
    }
}

//manually removes loading
function removeLoading() {
    console.log("Well that took some time..");
    
    const loader = document.querySelector('.loader');
    
    if (loader) {
        loader.classList.add('loader--hidden');
        
        loader.addEventListener('transitionend', () => {
            if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        });
    }
}
