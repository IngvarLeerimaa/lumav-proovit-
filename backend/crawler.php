<?php
function crawlWebsites() {
    $urls = file('testUrl.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $allData = [];

    foreach ($urls as $url) {
        $html = file_get_contents($url);

        if ($html === false) {
            continue;
        }

        // Kasuta DOM-i sisu parsimiseks
        $dom = new DOMDocument();
        @$dom->loadHTML($html);

        $xpath = new DOMXPath($dom);

        // Otsi tootenimesid, hindu ja kategooriaid
        $products = [];
        $categories = [];

        // Otsi tootenimed ja hinnad vastavalt veebilehe struktuurile
        $productNodes = $xpath->query("//article[@class='product_pod']"); // Iga toote plokk
        
        foreach ($productNodes as $node) {
            $name = $xpath->query(".//h3/a", $node)->item(0)->textContent ?? '';
            $price = $xpath->query(".//p[@class='price_color']", $node)->item(0)->textContent ?? '';
            $category = 'Books'; // Kuna leht on ainult raamatute jaoks

            // Kogume andmed toodete ja kategooriate kohta
            $products[] = [
                'name' => trim($name),
                'price' => trim($price),
                'category' => trim($category),
            ];

            // Kategooriad loendisse
            if (!isset($categories[$category])) {
                $categories[$category] = 0;
            }
            $categories[$category]++;
        }

        // Lisa kategooriate otsing: Leia kõik a href, kus on "category"
        $categoryNodes = $xpath->query("//a[contains(@href, 'category')]");

        // HashMapi jaoks
        $categoryMap = [];

        foreach ($categoryNodes as $node) {
            $href = $node->getAttribute('href');
            $categoryName = trim($node->textContent);
            
            // Veendume, et href ja kategooria nimi on olemas
            if (!empty($href) && !empty($categoryName)) {
                // URL võiks olla absoluutne, nii et ühendame selle baasaadressiga
                $absoluteUrl = rtrim($url, '/') . '/' . ltrim($href, '/');
                $categoryMap[$categoryName] = $absoluteUrl;
            }
        }

        $allData[] = [
            'url' => $url,
            'products' => $products,
            'categories' => $categories,
            'categoryMap' => $categoryMap // Lisa siia kategooria HashMap
        ];
    }

    return $allData;
}
?>
