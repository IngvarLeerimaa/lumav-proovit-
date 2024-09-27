/**Inits query to backend with GET req, if !err sends it to parseDate function"*/
function query() {
    console.log("we are searching");
    const token = localStorage.getItem('token');
    
    if (!token) {
        location.replace('index.html');
        return;
    }

    addLoading();
    
    fetch('http://localhost:8080/api/index.php', {
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

/**Creates buttons and adds button listners*/
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

/**Adds loading animation by creating the div with .loader*/
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

/**manually removes loading*/
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

/**Middle function that transforms data and sends it to render differenct charts*/ 
function parseData(webData) {
    console.log("Parsin Datat")
    console.log(webData);
    let parsedObj = getParsedObj(webData[0])
    console.log(parsedObj)
    createCanvasElements()
    renderScatter(parsedObj)
    renderLineChart(parsedObj)
    renderBarChart(parsedObj)
    renderBooksPieChart(parsedObj)
}

/**Takes jsonData, parses it for different charts and calculates avrage price/rating*/
function getParsedObj(data) {
    console.log(typeof(data));
    console.log(data);
    if (!data || !data.categories) {
        console.error("Data or categories are undefined");
        return [];
    }

    let ratingsList = [];
    let totalProducts = 0; // Initialize total product counter

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

        totalProducts += itemCount; // Increment total products with item count for this category

        ratingsList.push({ 
            category: category, 
            averageRating: averageRating, 
            productCount: itemCount, 
            averagePrice: averagePrice 
        });
    });

    ratingsList.totalProductCount = totalProducts;

    return ratingsList;
}

/**To make main.html dumber, creates divs for canvas*/
function createCanvasElements() {
    const canvasInfo = [
        { id: 'booksPieChart', className: 'circle' },
        { id: 'scatterChart', className: 'box' },
        { id: 'lineChart', className: 'box' },
        { id: 'barChart', className: 'box' }
    ];

    canvasInfo.forEach(info => {
        const canvas = document.createElement('canvas');
        
        canvas.id = info.id;
        canvas.className = info.className;
        
        document.body.appendChild(canvas);
    });
}

/** renders Barchart and does needed calculations */
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

/** renders Scatter chart and does needed calculations */
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
                label: 'Number of Products by Category',
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
            },
            layout: {
                backgroundColor: 'white'
        }}
    });
}

/** renders Line chart and does needed calculations */
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

/** renders piechart and does needed calculations */
function renderBooksPieChart(categoriesData) {
    const ctx = document.getElementById('booksPieChart').getContext('2d');

    const totalProducts = categoriesData.reduce((sum, category) => sum + category.productCount, 0);
    
    const sortedCategories = categoriesData.sort((a, b) => b.productCount - a.productCount);
    
    const topCategories = sortedCategories.slice(0, 5);
    
    const otherProductCount = sortedCategories.slice(5).reduce((sum, category) => sum + category.productCount, 0);
    
    const categoryLabels = topCategories.map(category => category.category).concat("Other");
    const productCounts = topCategories.map(category => category.productCount).concat(otherProductCount);
    
    const categoryPercentages = productCounts.map(count => (count / totalProducts * 100).toFixed(2));
    
    const backgroundColors = categoryLabels.map((_, index) => `rgba(${54 + index * 20}, 162, 235, 0.8)`);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categoryLabels,
            datasets: [{
                data: productCounts,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        boxWidth: 10,
                        color: 'white'
                    }
                },
                title: {
                    display: true,
                    text: 'Top 5 Categories by Product Count',
                    color: 'white'
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const label = categoryLabels[tooltipItem.dataIndex];
                            const value = productCounts[tooltipItem.dataIndex];
                            const percentage = categoryPercentages[tooltipItem.dataIndex];
                            return `${label}: ${value} products (${percentage}%)`;
                        }
                    }
                }
            },
            responsive: true,
            layout: {
                backgroundColor: '#dddddd'
            }
        }
    });
}

//Adds a animation
document.addEventListener('DOMContentLoaded', function() {
    addLoading()
    addSearchAndLogoutButton();
});

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
