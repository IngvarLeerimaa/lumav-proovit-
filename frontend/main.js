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
        console.log("Logged Out!")
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
    renderBarChart(byRating)
    renderLineChart(byRating)
    renderBooksPieChart()
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
        let totalPrice = 0;
        let itemCount = 0;

        Object.keys(data.categories[category]).forEach(itemKey => {
            let item = data.categories[category][itemKey];
            
            if (item && typeof item.rating !== 'undefined' && item.rating > 0) {
                totalRating += item.rating;
                itemCount++;
            }

            if (item && typeof item.price !== 'undefined' && item.price > 0) {
                totalPrice += parseFloat(item.price);
            }
        });

        let averageRating = itemCount > 0 ? Math.round((totalRating / itemCount) * 100) / 100 : 0;
        let averagePrice = itemCount > 0 ? Math.round((totalPrice / itemCount) * 100) / 100 : 0;

        ratingsList.push({ 
            category: category, 
            averageRating: averageRating, 
            productCount: itemCount, 
            averagePrice: averagePrice 
        });
    });

    return ratingsList;
}

function renderBarChart(categoriesData) {
    const ctx = document.getElementById('barChart').getContext('2d');

    const sortedData = categoriesData.sort((a, b) => b.averageRating - a.averageRating);

    const categoryLabels = sortedData.map(item => item.category);
    const averageRatings = sortedData.map(item => item.averageRating);

    const barColor = 'rgba(54, 162, 235, 0.8)';

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoryLabels,
            datasets: [{
                label: 'Average Rating',
                data: averageRatings,
                backgroundColor: barColor,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Categories Ranked by Average Rating'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Rating'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Category'
                    }
                }
            }
        }
    });
}

function renderScatter(categoriesData) {
    const ctx = document.getElementById('scatterChart').getContext('2d');

    const data = categoriesData.map(item => ({
        x: item.category,
        y: item.productCount
    }));

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Number of Products',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
function renderLineChart(categoriesData) {
    const ctx = document.getElementById('lineChart').getContext('2d');

    const categoryLabels = categoriesData.map(item => item.category);
    const averagePrices = categoriesData.map(item => item.averagePrice);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: categoryLabels,
            datasets: [{
                label: 'Average Price per Category',
                data: averagePrices,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: true,  
                pointRadius: 5
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Category'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Price'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Average Price per Category'
                }
            },
            responsive: true
        }
    });
}

function renderBooksPieChart() {
    const ctx = document.getElementById('booksPieChart').getContext('2d');

    const data = {
        labels: ['Books'],
        datasets: [{
            data: [100],
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: '100% of Products are Books'
                }
            },
            responsive: true
        }
    });
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
