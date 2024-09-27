<?php
/**
 * Crawls websites listed in the configuration file (config/url.txt) and extracts relevant data, 
 * including site names and category URLs. For each website, it retrieves the HTML content, parses it 
 * to find subcategories (specifically those related to "category/books"), and collects the URLs and names 
 * of these categories.
 * 
 * The function handles multiple websites, extracting their categories in a structured way, and 
 * subsequently performs concurrent crawling on all category URLs using a separate function to optimize 
 * speed. Once the data is collected, it maps each category back to its corresponding website.
 * 
 * This approach allows for efficient extraction of data from multiple websites and subcategories,
 * ensuring scalability as more URLs are added.
 * 
 * @return array $allData An array containing the site data, including their categories and corresponding data.
 */
function crawlWebsites() {
    $urls = file(__DIR__ . '/../config/url.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $allData = [];
    $categoryUrls = [];
    $categoryNames = [];

    foreach ($urls as $url) {
        $html = @file_get_contents($url);

        if ($html === false) {
            continue;
        }

        $dom = new DOMDocument();
        @$dom->loadHTML($html); 

        $xpath = new DOMXPath($dom);

        $siteNameNodes = $xpath->query("//title");
        $siteName = $siteNameNodes->length > 0 ? trim($siteNameNodes->item(0)->textContent) : 'Unknown Site';

        $categoryNodes = $xpath->query("//a[contains(@href, 'category/books/') and not(contains(@href, 'category/books_1'))]");

        foreach ($categoryNodes as $node) {
            $href = $node->getAttribute('href');
            $categoryName = trim($node->textContent);

            if (!empty($href) && !empty($categoryName)) {
                $categoryUrl = rtrim($url, '/') . '/' . ltrim($href, '/');
                $categoryUrls[] = $categoryUrl;
                $categoryNames[] = $categoryName;
            }
        }

        $allData[] = [
            'siteName' => $siteName,
            'url' => $url,
            'categories' => []
        ];
    }

    $categoryData = crawlCategoriesConcurrently($categoryUrls);

    foreach ($categoryNames as $index => $categoryName) {
        $allData[0]['categories'][$categoryName] = $categoryData[$index];
    }

    return $allData;
}

/**
 * Executes concurrent HTTP requests to multiple category URLs using cURL multi handle,
 * allowing for faster data retrieval by fetching multiple category pages simultaneously.
 * 
 * The function initializes a cURL multi handle, adds individual cURL handles for each
 * category URL, and processes them in parallel. Once the requests are completed,
 * it collects the responses and processes each category page using a custom parser.
 * 
 * This approach significantly speeds up the crawling process compared to sequential requests,
 * especially when dealing with a large number of category pages. It efficiently retrieves the 
 * data from all the URLs concurrently, then closes all cURL handles and returns the collected data.
 * 
 * @param array $categoryUrls List of URLs to be fetched concurrently.
 * @return array $categoryData Parsed data from each category page.
 */
function crawlCategoriesConcurrently($categoryUrls) {
    $multiCurl = curl_multi_init();
    $curlHandles = [];
    $categoryData = [];

    // Initialize cURL handles for each category URL
    foreach ($categoryUrls as $index => $categoryUrl) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $categoryUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_multi_add_handle($multiCurl, $ch);
        $curlHandles[$index] = $ch;
    }

    // Execute all requests concurrently
    $active = null;
    do {
        curl_multi_exec($multiCurl, $active);
        curl_multi_select($multiCurl);
    } while ($active);

    // Collect responses and fetch additional pages if necessary
    foreach ($curlHandles as $index => $ch) {
        $response = curl_multi_getcontent($ch);
        $categoryData[$index] = parseCategoryPage($response, $categoryUrls[$index]); 
        curl_multi_remove_handle($multiCurl, $ch);
        curl_close($ch);
    }

    // Close the multi cURL handle
    curl_multi_close($multiCurl);

    return $categoryData;
}

/**
 * Parses the HTML content of a category page to extract product details such as book name, price, and rating.
 * The function iterates through each product on the page, extracting relevant information using XPath queries.
 * It handles pagination by detecting the presence of a "next" button and fetching subsequent pages recursively
 * until all products are retrieved.
 * 
 * For each product, the function stores the following information: book ID, name, price, and rating. It continues 
 * parsing through multiple pages if the category spans across more than one page, dynamically building the correct 
 * next page URL. If any page fetch fails, it stops further processing for that category.
 * 
 * This function efficiently extracts and processes product data from paginated category pages.
 * 
 * @param string $html The HTML content of the category page.
 * @param string $categoryUrl The URL of the current category page being parsed.
 * @return array $products A list of products extracted from the category, each containing the book's name, price, and rating.
 */
function parseCategoryPage($html, $categoryUrl) {
    $products = [];
    $bookId = 0; 

    do {
        $dom = new DOMDocument();
        @$dom->loadHTML($html);
        $xpath = new DOMXPath($dom);

        $bookNodes = $xpath->query("//article[@class='product_pod']");

        foreach ($bookNodes as $node) {
            $bookNameNode = $xpath->query(".//h3/a", $node);
            $bookName = $bookNameNode->length > 0 ? trim($bookNameNode->item(0)->textContent) : 'Unknown Title';

            $bookPriceNode = $xpath->query(".//p[@class='price_color']", $node);
            $bookPrice = $bookPriceNode->length > 0 ? trim($bookPriceNode->item(0)->textContent) : '0.00';

            $bookRatingNode = $xpath->query(".//p[contains(@class, 'star-rating')]", $node);
            $bookRating = $bookRatingNode->length > 0 ? $bookRatingNode->item(0)->getAttribute('class') : '';

            $products[$bookId] = [
                'id' => $bookId,
                'name' => $bookName,
                'price' => filterPrice($bookPrice),
                'rating' => getBookRating($bookRating),
            ];

            $bookId++;
        }

        // Check if there's a "next" button
        $nextPageNode = $xpath->query("//li[@class='next']/a");

        if ($nextPageNode->length > 0) {
            // Build the correct next page URL
            $nextPageHref = $nextPageNode->item(0)->getAttribute('href');

            // Handle URLs that end with 'index.html' or have the proper page structure
            if (strpos($categoryUrl, 'index.html') !== false) {
                // If the URL ends with 'index.html', replace it with the next page href
                $nextPageUrl = str_replace('index.html', '', $categoryUrl) . ltrim($nextPageHref, '/');
            } else {
                // Otherwise, just append the next page href to the category URL
                $nextPageUrl = rtrim($categoryUrl, '/') . '/' . ltrim($nextPageHref, '/');
            }

          /*echo "Fetching next page: " . $nextPageUrl . PHP_EOL; */

            $html = @file_get_contents($nextPageUrl);

            if ($html === false) {
               // echo "Failed to fetch next page: " . $nextPageUrl . PHP_EOL;
                break;
            }

        } else {
            $html = null;
        }

    } while ($html !== null);

    return $products;
}

/**
 * Filters and cleans the price string by removing any non-numeric characters, except for the decimal point.
 * This function is useful for ensuring that the price values are in a clean numeric format, suitable for further processing or calculations.
 * It specifically strips out any currency symbols or other non-numeric characters, leaving only digits and the decimal point.
 * 
 * @param string $price The raw price string, potentially containing currency symbols or other characters.
 * @return string The cleaned price with only numbers and decimal points.
 */
function filterPrice($price) {
    return preg_replace('/[^0-9.]/', '', $price); // Keep only numbers and dots
}

/**
 * Determines the numerical rating of a book based on the CSS class of its rating element.
 * The function inspects the class name for specific keywords (e.g., "One", "Two", etc.)
 * and returns the corresponding numerical value between 1 and 5.
 * 
 * This method is useful for converting star-rating classes (typically found in HTML) 
 * into a numerical rating format that can be used for further processing or display.
 * 
 * @param string $ratingClass The CSS class name that represents the rating (e.g., "star-rating One").
 * @return int $rating The numerical rating extracted from the class name, ranging from 1 to 5.
 */

function getBookRating($ratingClass) {
    $rating = 0;

    if (strpos($ratingClass, 'One') !== false) {
        $rating = 1;
    } elseif (strpos($ratingClass, 'Two') !== false) {
        $rating = 2;
    } elseif (strpos($ratingClass, 'Three') !== false) {
        $rating = 3;
    } elseif (strpos($ratingClass, 'Four') !== false) {
        $rating = 4;
    } elseif (strpos($ratingClass, 'Five') !== false) {
        $rating = 5;
    }

    return $rating;
}
?>