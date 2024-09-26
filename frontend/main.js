function query() {
    console.log("we are searching");
    const token = localStorage.getItem('token');
    
    if (!token) {
        location.replace('index.html');
        return;
    }

    addLoading();
    
    fetch('http://localhost:8080/index.php', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(webData => {
        removeLoading();
        parseData(webData);
    })
    .catch(error => {
        removeLoading();
        console.error('Error:', error);
    });
}

function addSearchAndLogoutButton() {
    const searchButton = document.createElement('button');
    searchButton.textContent = "Search";
    searchButton.id = "searchButton";
    document.body.appendChild(searchButton);

    const logoutButton = document.createElement('button');
    logoutButton.textContent = "Logout";
    logoutButton.id = "logoutButton";
    document.body.appendChild(logoutButton);

    searchButton.addEventListener('click', function() {
        query();
    });

    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('token');
        location.replace('index.html');
    });
}

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



function parseData(webData) {
    console.log("Parsin Datat")
    console.log(webData);
    let byRating = getRatingsList(webData[0])
    console.log(byRating)
    renderScatter(byRating)
}

function getRatingsList(data) {
    console.log(typeof(data));
    console.log(data);
    if (!data || !data.categories) {
        console.error("Data or categories are undefined");
        return [];
    }

    let ratingsList = [];

    Object.keys(data.categories).forEach(category => {
        let totalRating = 0;
        let itemCount = 0;

        Object.keys(data.categories[category]).forEach(itemKey => {
            let item = data.categories[category][itemKey];
            
            // Check if item exists and has a rating
            if (item && typeof item.rating !== 'undefined' && item.rating > 0) {
                totalRating += item.rating;
                itemCount++;
            }
        });

        // Calculate the average rating and round up to one decimal
        let averageRating = itemCount > 0 ? Math.ceil((totalRating / itemCount) * 10) / 10 : 0;

        // Add category, average rating, and product count to the list
        ratingsList.push({ 
            category: category, 
            averageRating: averageRating, 
            productCount: itemCount 
        });
    });

    return ratingsList;
}

function renderScatter(categoriesData) {
    const ctx = document.getElementById('scatterChart').getContext('2d');

    // Prepare data for the scatter plot
    const data = categoriesData.map(item => ({
        x: item.category,
        y: item.productCount
    }));

    // Create the scatter plot
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Number of Products',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',  // Light blue
                borderColor: 'rgba(54, 162, 235, 1)',  // Blue
                pointRadius: 5
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Category'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Products'
                    }
                }
            }
        }
    });
}


function logOut() {
    console.log("Logged out.");
}

document.addEventListener('DOMContentLoaded', function() {
    addSearchAndLogoutButton();
});

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
