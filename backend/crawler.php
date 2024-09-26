<?php
function crawlWebsites() {
    $urls = file('url.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $allData = [];
    $categoryUrls = [];
    $categoryNames = [];

    // First, get all the category URLs
    foreach ($urls as $url) {
        $html = @file_get_contents($url);

        if ($html === false) {
            // Request failed, continue with the next URL
            continue;
        }

        $dom = new DOMDocument();
        @$dom->loadHTML($html); 

        $xpath = new DOMXPath($dom);

        // Extract the site name (from title or another identifier)
        $siteNameNodes = $xpath->query("//title");
        $siteName = $siteNameNodes->length > 0 ? trim($siteNameNodes->item(0)->textContent) : 'Unknown Site';

        // Find all subcategories with href links containing "category/books"
        $categoryNodes = $xpath->query("//a[contains(@href, 'category/books/') and not(contains(@href, 'category/books_1'))]");

        foreach ($categoryNodes as $node) {
            $href = $node->getAttribute('href');
            $categoryName = trim($node->textContent);

            if (!empty($href) && !empty($categoryName)) {
                $categoryUrl = rtrim($url, '/') . '/' . ltrim($href, '/');
                $categoryUrls[] = $categoryUrl; // Collect category URLs
                $categoryNames[] = $categoryName; // Collect category names for mapping later
            }
        }

        // Add the site data (without categories yet) to the final result
        $allData[] = [
            'siteName' => $siteName,
            'url' => $url,
            'categories' => []  // Categories will be added later
        ];
    }

    // Now, perform concurrent crawling for all category URLs
    $categoryData = crawlCategoriesConcurrently($categoryUrls);

    // Assign category data back to the site data
    foreach ($categoryNames as $index => $categoryName) {
        $allData[0]['categories'][$categoryName] = $categoryData[$index]; // Map categories to site
    }

    // Return all the crawled data
    return $allData;
}

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
        $categoryData[$index] = parseCategoryPage($response, $categoryUrls[$index]); // Parse category page
        curl_multi_remove_handle($multiCurl, $ch);
        curl_close($ch);
    }

    // Close the multi cURL handle
    curl_multi_close($multiCurl);

    return $categoryData;
}

function parseCategoryPage($html, $categoryUrl) {
    $products = [];
    $bookId = 0; // Initialize ID counter

    do {
        // Initialize DOM and XPath for the current page
        $dom = new DOMDocument();
        @$dom->loadHTML($html);
        $xpath = new DOMXPath($dom);

        // Get all book details from the current category page
        $bookNodes = $xpath->query("//article[@class='product_pod']");

        foreach ($bookNodes as $node) {
            $bookNameNode = $xpath->query(".//h3/a", $node);
            $bookName = $bookNameNode->length > 0 ? trim($bookNameNode->item(0)->textContent) : 'Unknown Title'; // Error handling

            $bookPriceNode = $xpath->query(".//p[@class='price_color']", $node);
            $bookPrice = $bookPriceNode->length > 0 ? trim($bookPriceNode->item(0)->textContent) : '0.00'; // Error handling

            $bookRatingNode = $xpath->query(".//p[contains(@class, 'star-rating')]", $node);
            $bookRating = $bookRatingNode->length > 0 ? $bookRatingNode->item(0)->getAttribute('class') : ''; // Error handling

            // Store the book details with ID and name
            $products[$bookId] = [
                'id' => $bookId,  // Assign an ID number
                'name' => $bookName,  // Add the book name
                'price' => filterPrice($bookPrice), // Remove fiat symbol from price
                'rating' => getBookRating($bookRating),
            ];

            $bookId++; // Increment the ID counter
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

          /*   // Debugging: Log the next page URL being fetched
            echo "Fetching next page: " . $nextPageUrl . PHP_EOL; */

            // Fetch the next page content
            $html = @file_get_contents($nextPageUrl);

            if ($html === false) {
                // Stop the loop if the next page couldn't be fetched
                echo "Failed to fetch next page: " . $nextPageUrl . PHP_EOL;
                break;
            }

        } else {
            // If no next page, stop the loop
            $html = null;
        }

    } while ($html !== null); // Continue while there is a next page

    return $products;
}




// Function to remove currency symbols from price
function filterPrice($price) {
    return preg_replace('/[^0-9.]/', '', $price); // Keep only numbers and dots
}

// Function to translate rating class to number of stars
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
