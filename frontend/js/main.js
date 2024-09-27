/**
 * Initiates a GET request to the backend API, passing an authorization token, and processes the response.
 * 
 * This function:
 * - Logs a message indicating that the search has started.
 * - Retrieves the token from `localStorage`. If no token is found, the user is redirected to the login page (`index.html`).
 * - Calls `addLoading()` to display a loading animation while the request is being processed.
 * - Sends a GET request to the backend API (`http://localhost:8080/api/index.php`) with the token included in the Authorization header.
 * - If the request is successful, the response is parsed as JSON and passed to the `parseData()` function for further processing.
 * - If an error occurs during the request, the loading animation is removed, and an error message is logged to the console.
 * 
 * This function provides a secure way to query data from the backend while ensuring the user is authenticated.
 * 
 * @return void
 */

function query() {
    /* console.log("we are searching"); */
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

/**
 * Creates and appends "Search" and "Logout" buttons to the page, and attaches event listeners to handle their functionality.
 * 
 * This function:
 * - Dynamically creates a "Search" button and appends it to the body of the document.
 * - Dynamically creates a "Logout" button and appends it to the body of the document.
 * - Adds a click event listener to the "Search" button that triggers the `query()` function when clicked.
 * - Adds a click event listener to the "Logout" button that removes the user's token from `localStorage`, redirects them to the login page (`index.html`), and logs a message indicating that the user has logged out.
 * 
 * This function ensures that the search and logout functionality is available on the page, allowing users to initiate searches and log out of their session easily.
 * 
 * @return void
 */

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
        /* console.log("Logged Out!") */
    });
}

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

/**
 * A central function responsible for transforming raw web data and passing it to various chart rendering functions.
 * 
 * This function:
 * - Logs the received `webData` to the console for debugging and data inspection purposes.
 * - Calls `getParsedObj()` to transform the first entry of `webData` into a structured format that can be used for rendering charts.
 * - Calls `createCanvasElements()` to dynamically create the necessary HTML canvas elements for rendering the charts.
 * - Passes the transformed data (`parsedObj`) to different chart rendering functions, including:
 *   - `renderScatter()` for generating a scatter plot.
 *   - `renderLineChart()` for creating a line chart.
 *   - `renderBarChart()` for displaying a bar chart.
 *   - `renderBooksPieChart()` for rendering a pie chart related to books data.
 * 
 * This function serves as the main driver for data transformation and chart visualization, ensuring that data flows through the necessary steps
 * to be displayed in different chart formats on the page.
 * 
 * @param array webData Raw data fetched from the web that needs to be transformed and visualized.
 * @return void
 */

function parseData(webData) {
    /* console.log("Parsin Datat") */
    /* console.log(webData); */
    let parsedObj = getParsedObj(webData[0])
    /* console.log(parsedObj) */
    createCanvasElements()
    renderScatter(parsedObj)
    renderLineChart(parsedObj)
    renderBarChart(parsedObj)
    renderBooksPieChart(parsedObj)
}

/**
 * Parses the raw data object to extract and calculate average ratings, average prices, and product counts for each category.
 * 
 * This function:
 * - Logs the type and content of the input data to the console for debugging.
 * - Checks if the input `data` object or its `categories` field is undefined, logging an error and returning an empty array if so.
 * - Iterates through each category in the data, calculating the total and average ratings, prices, and the number of products per category.
 * - For each category, it pushes an object containing the category name, average rating, product count, and average price to `ratingsList`.
 * - Calculates the total number of products across all categories and adds this information to the `ratingsList` object.
 * - Returns the `ratingsList`, which can then be used for chart rendering or other forms of data visualization.
 * 
 * This function is essential for transforming raw category data into a structured format with useful statistics, 
 * enabling easier analysis and charting of the data.
 * 
 * @param object data The raw data object containing categories and their associated products, ratings, and prices.
 * @return array ratingsList A list of category statistics, including average ratings, prices, and product counts.
 */

function getParsedObj(data) {
    /* console.log(typeof(data));
    console.log(data); */
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

/**
 * Dynamically creates and appends canvas elements to the webpage for chart rendering.
 * 
 * This function:
 * - Defines an array `canvasInfo` containing information about the canvas elements to be created, including their `id` and `className`.
 * - Iterates over the `canvasInfo` array, creating a new `<canvas>` element for each entry.
 * - Sets the `id` and `className` attributes for each canvas based on the values in `canvasInfo`.
 * - Appends each newly created canvas element to the body of the document for later use in rendering different types of charts.
 * 
 * This function is useful for setting up the canvas elements required to display various charts (e.g., pie, scatter, line, and bar charts)
 * on the webpage without predefining them in the HTML, allowing for a more dynamic chart generation process.
 * 
 * @return void
 */

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

/**
 * Renders a bar chart displaying the average rating for each category, using the provided category data.
 * 
 * This function:
 * - Selects the canvas element with the id `barChart` and gets its 2D rendering context for chart drawing.
 * - Sorts the category data in descending order based on the `averageRating` to rank categories by their ratings.
 * - Extracts category labels and their corresponding average ratings from the sorted data to be used as the chart's data.
 * - Creates a new bar chart using the Chart.js library, with the category names on the x-axis and average ratings on the y-axis.
 * - Customizes the chart with a title ("Categories Ranked by Average Rating"), hiding the legend for simplicity, and setting appropriate axis titles.
 * - The chart bars are rendered in a blue shade (`rgba(54, 162, 235, 0.8)`), and the y-axis begins at zero to show accurate rating comparisons.
 * 
 * This function is used to visually represent the average rating of different categories, making it easier to compare category performance at a glance.
 * 
 * @param array categoriesData An array of objects containing category names and their corresponding average ratings.
 * @return void
 */

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

/**
 * Renders a scatter plot displaying the number of products for each category using the provided category data.
 * 
 * This function:
 * - Selects the canvas element with the id `scatterChart` and gets its 2D rendering context for chart drawing.
 * - Maps the category data into a format suitable for the scatter plot, where each point represents a category (x-axis) and its product count (y-axis).
 * - Creates a new scatter chart using the Chart.js library, plotting the number of products for each category.
 * - Customizes the chart by setting category names on the x-axis and product counts on the y-axis, with the y-axis starting from zero for accurate comparisons.
 * - Configures the points to be displayed in a blue shade (`rgba(54, 162, 235, 0.5)`) with a border and point radius of 5 for clear visibility.
 * 
 * This scatter plot visually represents the distribution of products across different categories, providing insights into which categories have the most or fewest products.
 * 
 * @param array categoriesData An array of objects containing category names and their corresponding product counts.
 * @return void
 */

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

/**
 * Renders a line chart displaying the average price per category using the provided category data.
 * 
 * This function:
 * - Selects the canvas element with the id `lineChart` and gets its 2D rendering context for chart drawing.
 * - Extracts the category labels (x-axis) and their corresponding average prices (y-axis) from the category data.
 * - Creates a new line chart using the Chart.js library, plotting the average price for each category.
 * - Customizes the chart with a line that has a blue color (`rgba(54, 162, 235, 0.5)`) and a border to enhance visibility, along with filled areas under the line.
 * - Configures the x-axis to display category names and the y-axis to show average prices, with the y-axis starting from zero for accurate comparisons.
 * - Adds a legend and chart title, providing context for the data being displayed ("Average Price per Category").
 * 
 * This line chart helps visualize price trends across different categories, allowing for easy comparison of average prices.
 * 
 * @param array categoriesData An array of objects containing category names and their corresponding average prices.
 * @return void
 */

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

/**
 * Renders a pie chart displaying the top 5 categories by product count, along with an "Other" category for remaining products.
 * 
 * This function:
 * - Selects the canvas element with the id `booksPieChart` and gets its 2D rendering context for chart drawing.
 * - Calculates the total number of products across all categories and sorts the categories by product count in descending order.
 * - Extracts the top 5 categories with the highest product counts and groups the remaining categories into an "Other" slice.
 * - Converts the product counts into percentages relative to the total product count.
 * - Dynamically generates background colors for the pie slices.
 * - Creates a pie chart using the Chart.js library, displaying category names and their corresponding product counts and percentages in the legend.
 * - Customizes tooltips to show both the product count and percentage for each category when hovering over a pie slice.
 * - Configures the chart to be responsive and adjusts the layout to ensure the legend and chart are displayed clearly.
 * 
 * This pie chart provides a visual representation of the distribution of products across the top categories, helping to identify which categories dominate the dataset.
 * 
 * @param array categoriesData An array of objects containing category names and their corresponding product counts.
 * @return void
 */
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

/**
 * Adds an animation and search/logout buttons to the page after the DOM has fully loaded.
 * 
 * This function:
 * - Attaches an event listener to the `DOMContentLoaded` event to ensure that the DOM is fully parsed before executing the code.
 * - Calls `addLoading()` to initiate a loading animation, indicating that content or resources are being processed.
 * - Calls `addSearchAndLogoutButton()` to dynamically create and add a search bar and logout button to the page.
 * 
 * This ensures that the animation and interactive elements are ready as soon as the page is loaded, enhancing the user experience.
 * 
 * @return void
 */
document.addEventListener('DOMContentLoaded', function() {
    addLoading()
    addSearchAndLogoutButton();
});

/**
 * Ends the loading animation that was started when the DOM content loaded, once all page resources (images, scripts, etc.) have fully loaded.
 * 
 * This function:
 * - Attaches an event listener to the `load` event of the window, ensuring that it runs after all resources have been completely loaded.
 * - Selects the `.loader` element and adds the `.loader--hidden` class to initiate the hide animation.
 * - Once the transition ends, it removes the loader element from the DOM to prevent it from affecting the page layout or performance.
 * 
 * This approach ensures that the loader is visible while the page is loading and is hidden and removed once the page is fully ready, improving the user experience.
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
