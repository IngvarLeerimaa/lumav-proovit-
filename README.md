# Proovitöö

Järgneva proovitöö eesmärk on luua web-scraper kasutades php back-endi ja Vanilla JavaScripti. Soovitatud on kasutada AI'd ülesande lahendamisel.

# Kasutamine
Mina jooksutasin kahte serverit kasutades composeri keyword `start` ja VSCode Live server pluginat. Võid kasutada endale sobivamat varianti, kuid ma ei taga samaväärse funktsionaalsuse.

**Entry point:** [https:localhost:5500/frontend](https:localhost:5500/frontend/)
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

    *Vajadusel saab muuta porte failides backend/composer.json(ln15), frontend/index.js(ln21), frontend/main.js(ln12).*
- Frontend: 5500

    *Muutmiseks vt Live Server settingutesse.*
# Tööjuhend

### Back-end:
 - Loo PHPs API endpoint, mille kaudu kraabid e-poodide avalehti. (Veebipoe urlid võivad volla teksti failis.)
 - API analüüsib lehti vastavalt struktuurile (nimekirjad, hinnad, kategooriad jms)
- Kategooriad on lisitina
- Lisa turvalisus tagamiseks meetmeid.
- Returni JSON

### Front-end
- Lihtne Dashboard, mis kuvab API vastused
- Lisa search NUPP
- Lisagraafikud (hinnad, kategooriad jms)
- Viis scrape näitamiseks reaalajas

### Kuvamine

- Toodete loetelu ja hinnad
- Allahindlkused ja pakkumised
- **Required** Populaarsed kategoorida: Enim esindatud kategooriad peavad olema kuvatud. 

## Guidelines

- Kõik peab olema Githubis
- Kõik muutused peavad olema dokumenteeritud selge commitiga

# Testing

- Repo clone ja jooksutamine.

# Strucktuur
root/
├── backend/
│   ├── api/
│   │   ├── login.php         # API päringute töötlemine (login)
│   │   ├── crawler.php       # Crawlimise API ja loogika
│   │   ├── index.php         # API põhifail
│   └── config/
│       ├── config.php        # Konfiguratsiooni failid (API võtmed jms)
│       ├── token.txt         # Tokenite fail
│       ├── urls.txt          # E-kaubanduse URLide loend
│   ├── vendor/               # Composer'i kolmanda osapoole teegid
│   ├── composer.json         # Composer'i sõltuvused
│   ├── composer.lock         # Composer'i lukustusfail
├── frontend/
│   ├── assets/
│   │   ├── favicon.ico       # Favicon
│   ├── css/
│   │   ├── index.css         # Login UI stiilid
│   │   ├── main.css          # Peamise UI stiilid
│   ├── js/
│   │   ├── index.js          # Login JS
│   │   ├── main.js           # Peamise lehe JS (graafikud, UI)
│   ├── index.html            # Login leht
│   ├── main.html             # Graafikute ja andmete leht
├── README.md                 # Projekti dokumentatsioon


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
- Chart.js
- JSON

### AI:
- ChatGPT 4o (Veaotsing jms)

*Projekt on loodud kasutades Win10 WSL Ubuntut ja VSCode tarkvara.*

