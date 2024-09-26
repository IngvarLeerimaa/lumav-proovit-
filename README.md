# Proovitöö

Järgneva proovitöö eesmärk on luua web-scraper kasutades php back-endi ja Vanilla JavaScripti. Soovitatud on kasutada AI'd ülesande lahendamisel.

# Kasutamine

**Entry point:** ```https:localhost:5500/frontend/```
Mina jooksutasin kahte serverit kasutades composerit ja VSCode Live server pluginat. Võid kasutada endale sobivamat varianti.
- **Klooni repo**
- **Backend:**
    
    Navigeeri backend kausta ja kasuta composeri keywordi start. Näide ```composer start```
    
    *Vajadusel composer install/composer update*

    Võib ka kasutada lihtsalt käsklust ```php -S localhost:8080```
    - **backend sulgemine:**
        Terminalis ```Ctrl + C```
        Või manuaalselt
        ``` ps aux | grep php``` ja ``` kill <PID>```
-   **Frontend:**
    
    Installi Live Server plugin.
    Ava Command pallette (```Ctrl + shift + P)```) ja vali **Live Server: Open with Live Server** või kasuta ikooni all paremas nurgas.
    - **frontend sulgemine:**
        Paremal all ikoonist või ava controll pallette ja vali "Live Server: Stop Live Server"

**Default pordid:**
- Backend: 8080

    *Vajadusel saab muuta porte failides backend/composer.json(ln15), frontend/index.js(ln21), frontend/main.js.*
- Frontend: 5500

    *Muutmiseks vt Live Server settingutesse.*
# Eesmärgid

### Back-end:
 - Loo PHPs API endpoint, mille kaudu kraabid e-poodide avalehti. (Veebipoe urlid võivad volla teksti failis.)
 - API analüüsib lehti vastavalt struktuurile (nimekirjad, hinnad, kategooriad jms)
- Kategooriad on lisitina
- Lisa turvalisus tagamiseks meetmeid.
- Returni JSON

### Front-end
- Lihtne Dashboard, mis kuvab API vastused
- Lisa searchbar
- Lisagraafikud (hinnad, kategooriad jms) (piechart, barchart vast kõige lihtsam. Äkki kasutada apexcharti?)
- Kategooriad tableina
- Viis scrape näitamiseks reaalajas??????? vbl lihtasalt loading cursor vms.

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

- Repo clone ja jooksutamine.

# Strucktuur
# LOO funktsioonidele eraldi failid et veits loetavam oleks.
```
root/
├── backend/
│   ├── index.php           # Main API file
│   ├── crawler.php         # Crawling logic
│   └── config.php          # Configuration (API keys, etc.)
│   └── urls.txt            # List of e-commerce homepages
├── frontend/
│   ├── favicon.ico         # Icon
│   ├── index.html          # Login
│   ├── main.html           # Graphs and data
│   ├── index.css           # Login UI
│   ├── main.css            # Main UI
│   ├── index.js            # Handles login and token
│   └── main.js             # Handles frontend Graphs and UI
└── README.md               # Project documentation
```

# Kasutatud tehnoloogiad
### Back-end:
- PHP - 8.3.11
- Composer 2.7.9
- sunra 1.5.2
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

