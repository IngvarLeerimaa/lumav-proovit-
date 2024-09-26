# Proovitöö

Järgneva proovitöö eesmärk on luua web-scraper kasutades php back-endi ja Vanilla JavaScripti. Soovitatud on kasutada AI'd ülesande lahendamisel.

# Eesmärgid

### Back-end:
 - Loo PHPs API endpoint, mille kaudu kraabid e-poodide avalehti. (Veebipoe urlid võivad volla teksti failis.)
 - API analüüsib lehti vastavalt struktuurile (nimekirjad, hinnad, kategooriad jms)
- Kategooriad on lisitina
- Lisa turvalisus tagamiseks meetmeid. (JWT?)
- Returni JSON

### Front-end
- Lihtne Dashboard, mis kuvab API vastused
- Lisa searchbar
- Lisagraafikud (hinnad, kategooriad jms) (piechart, barchart vast kõige lihtsam. Äkki kasutada apexcharti?)
- Kategooriad tableina
- Viis scrape näitamiseks reaalajas???????

### Kuvamine

- Toodete loetelu ja hinnad
- Allahindlkused ja pakkumised
- **Required** Populaarsed kategoorida: Enim sindatud kategooriad peavad olema kuvatud. 

### Graafikud

- Piechart - Kui palju tooteid esinab iga kategooria
- Column Chart with datalabels - Toodete hinnavahemik ja jaotus
- line chart - Allahindlused
- line chart with data points- Populaarsed trendid, ehk tooted mida vaadatakse kõige enam.

## Guidelines

- Kõik peab olema Githubis
- Kõik muutused peavad olema dokumenteeritud selge commitiga

# Testing

- Lihtne repo clone ja jooksutamine erinevate urlidega.

# Strucktuur

```
root/
├── backend/
│   ├── index.php           # Main API file
│   ├── crawler.php         # Crawling logic
│   └── config.php          # Configuration (API keys, etc.)
├── frontend/
│   ├── index.html          # Dashboard page
│   └── app.js              # JavaScript for frontend logic
├── urls.txt                # List of e-commerce homepages
└── README.md               # Project documentation
```

# Kasutatud tehnoloogiad
### Back-end:
- PHP - 8.3.11
- Composer
- **LISA KASUTATUD ASJAD**

### Front-end:
- JS - 12.22.9
- HTML
- CSS
- Fetch API
- **CHARTi ASI**
- JSON

### AI:
- ChatGPT 4o (Veaotsing jms)

*Projekt on loodud kasutades Win10 WSL Ubuntut ja VSCode tarkvara.*

