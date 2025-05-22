document.addEventListener('DOMContentLoaded', function () {
    const mainPasswordInput = document.getElementById("password");
    const passwordDisplayContainer = document.getElementById("password-display-container");
    const lengthInput = document.getElementById("length");
    const lengthValue = document.getElementById("length-value");
    const loadingContainer = document.getElementById("loading-container");
    const additionalPasswordTitle = document.getElementById("additional-password-title");

    const specialChars = "~!@#$%^&*()_+{}|:\"<>?[]".split('');

    // Asegurarse de que la sección de contraseñas adicionales esté visible al cargar el sitio
    function initializeAdditionalPasswordsSection() {
        // Generar 5 contraseñas alternativas iniciales
        passwordDisplayContainer.innerHTML = ''; // Limpiar primero
        for (let i = 0; i < 5; i++) {
            const altPasswordInput = document.createElement("input");
            altPasswordInput.type = "text";
            altPasswordInput.readOnly = true;
            altPasswordInput.value = generatePassword(15);
            passwordDisplayContainer.appendChild(altPasswordInput);
        }
    }

    // Llamar a la función de inicialización al cargar la página
    initializeAdditionalPasswordsSection();

    // Resto del código permanece igual...
    lengthInput.addEventListener('input', function () {
        lengthValue.textContent = lengthInput.value;
    });

    function generatePassword(length = 15) {
        return Array(length)
            .fill()
            .map(() => String.fromCharCode(Math.floor(Math.random() * 94 + 33)))
            .join('')
            .replace(/[eEoOI]/g, c => {
                switch (c) {
                    case 'e': return String.fromCharCode(97 + Math.floor(Math.random() * 26));
                    case 'E': return String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    case 'o': return 'n';
                    case 'O': return 'N';
                    case 'I': return specialChars[Math.floor(Math.random() * specialChars.length)];
                }
            });
    }

    function showLoading() {
        loadingContainer.style.display = 'block';
    }

    function hideLoading() {
        loadingContainer.style.display = 'none';
    }

    document.getElementById("generate-password-button").addEventListener("click", function () {
        showLoading();
        setTimeout(() => {
            mainPasswordInput.value = generatePassword(parseInt(lengthInput.value));
            passwordDisplayContainer.innerHTML = '';

            for (let i = 0; i < 5; i++) {
                const altPasswordInput = document.createElement("input");
                altPasswordInput.type = "text";
                altPasswordInput.readOnly = true;
                altPasswordInput.value = generatePassword(15);
                passwordDisplayContainer.appendChild(altPasswordInput);
            }

            hideLoading();
        }, 500);
    });

    document.getElementById("copy-to-clipboard").addEventListener("click", function () {
        navigator.clipboard.writeText(mainPasswordInput.value).then(() => {
            alert("Password copied to clipboard!");
        });
    });

    document.getElementById("toggle-theme").addEventListener("click", function () {
        const themeStyle = document.getElementById("theme-style");
        themeStyle.href = themeStyle.href.includes("light.css") ? "/static/css/dark.css" : "/static/css/light.css";
    });
});