# Proovitöö

Järgneva proovitöö eesmärk on luua web-scraper kasutades php back-endi ja Vanilla JavaScripti. Soovitatud on kasutada AI'd ülesande lahendamisel.

Proovitöö juhend on leitav [siin.](https://docs.google.com/document/d/1POu6ZdqqYIkPwAWv4oS1_wi3pfm5uYll/edit)
# Kasutamine
*Jooksutasin kahte serverit kasutades composeri keyword `start` ja VSCode Live server pluginat. Võid kasutada endale sobivamat varianti, kuid ma ei taga samaväärse funktsionaalsuse.*

**Entry point:** [https:localhost:5500/frontend](https:localhost:5500/frontend/)

### Step-by-step
- **Klooni repo**
- **Backend:**
    
    Navigeeri backend kausta ja kasuta composeri keywordi start. Näide ```composer start```
    
    *Vajadusel composer install/composer update etc.*

    Võib ka kasutada lihtsalt käsklust ```php -S localhost:8080```
    - **backend sulgemine:**
        Terminalis ```Ctrl + C```
        või manuaalselt
        ``` ps aux | grep php``` ja ``` kill <PID>```
-   **Frontend:**
    
    Installi Live Server plugin.
    Ava Command pallette (```Ctrl + shift + P)```) ja vali **Live Server: Open with Live Server** või kasuta ikooni all paremas nurgas.
    - **frontend sulgemine:**
        Paremal all ikoonist või ava controll pallette ja vali "Live Server: Stop Live Server"

**Default pordid:**
- Backend: 8080

    *Vajadusel saab muuta porte failides backend/composer.json(ln15), frontend/js/index.js(ln32), frontend/js/main.js(ln28).*
- Frontend: 5500

    *Muutmiseks vt Live Server settingutesse.*

## Piirangud

- Kõik peab olema Githubis
- Kõik muutused peavad olema dokumenteeritud selge commitiga
- Ei tohi kasutada raamistikke

## Testimine

- Repo kloonimine ja jooksutamine.

# Struktuur
```
root/
├── backend/
│   ├── api/
│   │   ├── login.php         # API päringute töötlemine (login)
│   │   ├── crawler.php       # Crawlimise API ja loogika
│   │   ├── index.php         # API põhifail
│   └── config/
│       ├── token.txt         # Tokenite fail
│       ├── urls.txt          # URL
│       ├── users.txt         # Kasutajad ja paroolid
│   ├── vendor/               # Composer'i kolmanda osapoole teegid
│   ├── composer.json         # Composer'i sõltuvused
│   ├── composer.lock         # Composer'i lukustusfail
├── frontend/
│   ├── assets/
│   │   ├── favicon.ico       # Favicon
│   ├── css/
│   │   ├── index.css         # Login lehe stiilid
│   │   ├── main.css          # Peamise lehe stiilid
│   ├── js/
│   │   ├── index.js          # Login funktsionaalsus ja tokenite haldus
│   │   ├── main.js           # Dashboardi ja API tulemuste kuvamine
│   ├── index.html            # Login leht
│   ├── main.html             # Graafikute ja andmete kuvamise leht
├── README.md                 # Projekti dokumentatsioon
```

### Backend
- **api/**: Sisaldab API-d, mis vastutab veebisaitide kraapimise ja andmete töötlemise eest.
    - **login.php**: Vastutab kasutaja autentimise ja tokenite genereerimise eest. Kasutajad saadavad oma emaili ja parooli ning saavad vastuseks unikaalse tokeni.
    - **crawler.php**: Käivitab veebisaitide kraapimise ning tagastab kraabitud andmed. Käib läbi veebilehtede kategooriad ja kogub informatsiooni toodete kohta.
    - **index.php**: Peamine API-fail, mis haldab päringud ja vastused. Kasutatakse andmete pärimiseks ja töötlemiseks.

- **config/**: Konfiguratsioonifailid, mis sisaldavad süsteemi jaoks olulisi andmeid.
  - `token.txt`: Kasutajate autentimiseks mõeldud tokenite fail.
  - `urls.txt`: Loend kraabitavatest e-kaubanduse veebilehtede URL-idest.
  - `users.txt`: Kasutajate autentimisinfo (emailid ja paroolid).

- **vendor/**: PHP kolmanda osapoole teegid, mis on installitud Composer'i abil.
  - `composer.json`: Fail, mis haldab PHP projekti sõltuvusi.
  - `composer.lock`: Fail, mis lukustab sõltuvuste versioonid.

### Frontend
- **assets/**: Staatilised varad, nagu favicon.
  - `favicon.ico`: Favicon, mis kuvatakse brauseri tab-il.

- **css/**: Stiilifailid lehtede kujundamiseks.
    - **index.css**: Stiilifail, mis haldab login-lehe välimust ja paigutust.
    - **main.css**: Stiilifail, mis haldab dashboardi ja graafikute välimust.

- **js/**: JavaScript-failid, mis haldavad kasutajate autentimist ja andmete kuvamist.
    - **index.js**: Kasutatakse login-protsessi haldamiseks, sh kasutajate autentimine ja tokenite kontroll.
    - **main.js**: Vastutab kraabitud andmete kuvamise eest erinevates graafikutes (scatter, bar, line, pie chart), kasutades Chart.js-i.

### Funktsioonid ja API lõpp-punktid:

#### Backend API:
- **POST /api/login.php**: 
  - Kirjeldus: Kasutajate autentimine. Kasutaja saadab emaili ja parooli ning saab vastuseks tokeni, kui sisetatud andmed on õiged.
  - Päised:
    - `Authorization: Basic base64(email:password)`
  - Tagastab:
    ```json
    {
      "token": "your-token-here"
    }
    ```

- **GET /api/index.php**: 
  - Kirjeldus: Tagastab kraabitud andmed. Kasutaja peab saatma kehtiva tokeni, et päring oleks lubatud.
  - Päised:
    - `Authorization: Bearer your-token-here`
  - Tagastab:
```json
    [
  {
    "siteName": "All products | Books to Scrape - Sandbox",
    "url": "https://books.toscrape.com/",
    "categories": {
      "Travel": [
        {
          "id": 0,
          "name": "It's Only the Himalayas",
          "price": "45.17",
          "rating": 2
        },
        ...
      "Crime": [
        {
          "id": 0,
          "name": "The Long Shadow of ...",
          "price": "10.97",
          "rating": 1
        }
      ]
    }
  }
]
```

### Turvalisus:
- **Token-põhine autentimine**: Iga kasutaja peab edukalt sisse logima, et saada unikaalne token, mida kasutatakse kõikides järgnevatel API päringutel.
- **Authorization päis**: API päringute autentimiseks ja andmetele ligipääsemiseks on vaja lisada Authorization päis vastava tokeniga.

### Frontendi funktsioonid:
- **Login**: Kasutajate autentimine, kontrollitakse mandaate ja kui need on õiged, salvestatakse token brauseri `localStorage`-i.
- **Dashboard**: Kuvab erinevaid graafikuid kraabitud andmete põhjal (nt scatter, bar, line ja pie chart), kasutades saadud andmeid backend API-st.

### Graafikutüübid:
- **Pie Chart**: Visualiseerib viit suurimat kategooriat toodete arvu järgi ja lisab "Other" kategooria ülejäänud toodete jaoks.
- **Scatter Chart**: Kuvab toodete arvu kategooriate kaupa.
- **Line Chart**: Näitab keskmise hinna trende erinevates kategooriates.
- **Bar Chart**: Järjestab kategooriad keskmise reitingu alusel.

### Tulevikuplaanid:
- Parandada kraapimisprotsessi efektiivsust
- Tõhustada veakäsitlust ja kasutajale tagasiside andmist nii frontendis kui ka backendis
- Luua turvaline ja usaldusväärne andmebaas kasutajate andmete haldamiseks, et parandada autentimise ja andmehoidmise protsessi
- Parandada frontendi responsiivsust, et tagada sujuv ja optimeeritud kasutajakogemus erinevatel seadmetel ja ekraanisuurustel


### Kasutatud tehnoloogiad:

- **PHP**
- **Composer**
- **JavaScript (Vanilla JS)**
- **Chart.js**
- **HTML5**
- **CSS3**
- **JSON**
- **LocalStorage**
- **Fetch API**
- **Thunder Client Plugin**
- **Live Server Plugin**
- **Git**
- **Github**
- **ChatGPT 4o**: (Veaotsing, dokumentatsioon)

*Projekt on loodud kasutades Win10 WSL Ubuntut ja VSCode tarkvara.*

### Nõuded

- PHP 8.0 või uuem versioon
- Brauseri tugi JavaScripti ja HTML5 jaoks

### Soovitatud
- Composer