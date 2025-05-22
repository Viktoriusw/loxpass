function updateLength(value) {
    document.getElementById('length-value').textContent = value;
}

function generatePassword() {
    const length = document.getElementById('length').value;
    const numbers = document.getElementById('numbers').checked;
    const uppercase = document.getElementById('uppercase').checked;
    const lowercase = document.getElementById('lowercase').checked;
    const special = document.getElementById('special').checked;

    fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ length, numbers, uppercase, lowercase, special })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('password').value = data.password;
    });
}

function copyToClipboard() {
    const password = document.getElementById('password');
    password.select();
    document.execCommand('copy');
    alert('Contraseña copiada al portapapeles');
}
