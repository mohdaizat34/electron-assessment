const PouchDB = require('pouchdb-browser');
const db = new PouchDB('assessment_db');

//-----------------------------------------------------------------------------------------
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    login(email, password);
});

function login(email, password) {
    fetch('http://test-demo.aemenersol.com/api/account/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            document.getElementById('loginError').style.display = 'block';
            validateCredentials(email,password) 
            throw new Error('response not ok');
            
        }
        return response.json();
    })
    .then(data => {
        if (data) {
            console.log('success, Token:', data);
            validateCredentials(email,password)
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    })

    function validateCredentials(email,password) {
        db.get('credentials').then(doc => {
            if (doc.email == email && doc.password == password) {
                console.log('credentials are validated through pouchdb and success', doc);
                window.location.href = 'dashboard.html'; 
            } else {
                document.getElementById('loginError').style.display = 'block';
                console.log('credentials are validated through pouchdb and not success', doc);
            }
        }).catch(error => {
            console.error('Error retrieving credentials from PouchDB:', error);
            document.getElementById('loginError').style.display = 'block';
        });
    }
}
