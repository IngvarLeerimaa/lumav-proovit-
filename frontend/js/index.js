/**
 * Handles the login logic by either posting the user's credentials to the backend or redirecting to the main page if a valid token is already present.
 * 
 * This function:
 * - First checks if a token is stored in `localStorage`. If the token is present, the user is redirected to `main.html`.
 * - If no token is found, it attaches an event listener to the login form. On form submission, the function sends the user's 
 *   email and password in a base64-encoded format via a POST request to the backend login API.
 * - If the response contains a valid token, it stores the token in `localStorage` and redirects the user to `main.html`.
 * - If an error occurs (such as invalid credentials or an internal error), it displays an error message and keeps the loading animation active until the process finishes.
 * - The function also handles internal errors and ensures that the loading animation is removed appropriately in case of failure or success.
 * 
 * This approach ensures that the user is authenticated before accessing the main content and retains the session using token-based authentication.
 * 
 * @return void
 */

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
            
            const response = await fetch('http://localhost:8080/api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${credentials}`
                }
            });

            try {
                token = await response.json();
            } catch (err) {
                let err2 = document.getElementById('err');
                err2.innerHTML = "Internal error - check console"
                err2.style.display = 'block';
                setTimeout(() => {
                    err2.style.display = 'none';
                }, 3000);
                removeLoading();
                throw new Error('Error:', token.error);
            }

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

/**
 * Attaches an event listener to the `DOMContentLoaded` event to ensure that the initial functions are called 
 * once the HTML document has been fully loaded and parsed, but before images and other resources are fully loaded.
 * 
 * This function:
 * - Calls `addLoading()` to display a loading animation while the page is being processed.
 * - Calls `createForm()` to dynamically generate and display a login form on the page.
 * - Calls `login()` to initialize the login logic, allowing the user to submit their credentials.
 * 
 * Using `DOMContentLoaded` ensures that the page structure is ready before attempting to manipulate the DOM, 
 * improving performance and preventing errors that might occur if the DOM is not fully available.
 * 
 * @return void
 */

document.addEventListener('DOMContentLoaded', function() {
    addLoading();
    createForm();
    login();

 });

/**
 * Dynamically creates and appends a login form to the webpage, including input fields, titles, and error handling elements.
 * 
 * This function:
 * - Creates a container `<div>` element and appends it to the body of the document.
 * - Inside the container, it generates a `<form>` element with a title, a subtitle showing example credentials, 
 *   and input fields for the user's email/username and password.
 * - Adds a hidden error label for displaying invalid credential messages and a submit button for submitting the form.
 * 
 * This form creation is useful for dynamically injecting a login interface into a page without needing to pre-define the HTML structure,
 * providing flexibility for login interfaces that can be modified or styled with JavaScript.
 * 
 * @return void
 */

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

/**
 * Listens for the window's `load` event to hide and remove the loading animation once the page has fully loaded.
 * 
 * This function:
 * - Attaches an event listener to the `load` event of the `window`, ensuring that it only runs after all page resources (images, scripts, etc.) are fully loaded.
 * - Selects the element with the `.loader` class and, if found, adds the `.loader--hidden` class to trigger its hiding transition.
 * - Once the transition ends, the loader is removed from the DOM to free up resources and prevent it from affecting page performance or layout.
 * 
 * This function is typically used to ensure that a loading screen or animation is displayed only while the page is still loading, 
 * and is automatically hidden and removed once the page has fully loaded.
 * 
 * @return void
 */

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

/**
 * Manually adds or displays a loading animation on the page when an asynchronous operation starts.
 * 
 * This function:
 * - Logs a message to the console indicating that a process is waiting.
 * - Checks if a loader element with the class `.loader` already exists on the page.
 *   - If the loader does not exist, it creates a new loader element, adds the `.loader` class, and appends it to the body.
 *   - If the loader exists but is hidden, it removes the `.loader--hidden` class to display it again.
 * 
 * This is typically used to show a loading animation when an asynchronous operation starts and visually indicate to the user that something is in progress.
 * 
 * @return void
 */
function addLoading() {
    /* console.log("We are waiting..."); */

    let loader = document.querySelector('.loader');
    
    if (!loader) {
        loader = document.createElement('div');
        loader.classList.add('loader');
        document.body.appendChild(loader);
    } else {
        loader.classList.remove('loader--hidden');
    }
}

/**
 * Manually removes the loading animation from the page once the loading process is complete.
 * 
 * This function:
 * - Logs a message to the console indicating that the loading process took some time.
 * - Selects the HTML element with the class `.loader` and, if found, adds the `.loader--hidden` class to initiate the hiding transition.
 * - After the transition ends, it removes the loader element from the DOM to ensure it no longer affects the page layout or performance.
 * 
 * This is typically used in cases where a loading animation is displayed during asynchronous operations,
 * and you want to manually trigger its removal once the operations are finished.
 * 
 * @return void
 */
function removeLoading() {
    /* console.log("Well that took some time.."); */
    
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
