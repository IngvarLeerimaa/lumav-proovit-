async function query() {
    console.log("we are here")
    
    // Kuvame laadimisekraani
    document.getElementById('loading-screen').style.display = 'show';

    const token = localStorage.getItem('token');
    if (!token){
        location.replace('index.html');
        return;  // Peatame funktsiooni
    }

    try {
        const response = await fetch('http://localhost:8080/index.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const webData = await response.json();
        console.log(webData);

        // Peidame laadimisekraani pärast andmete kättesaamist
    } catch (error) {
        console.error('Error:', error);

        // Peidame laadimisekraani, kui esineb viga
        document.getElementById('loading-screen').style.display = 'none';
    }
    console.log(webData)
}

query();
