function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function formatDatabaseName(company) {
    return 'BDComercial' + company.split(' ').map(capitalizeFirstLetter).join('');
}

function generateCDSWEB() {
    const companyName = document.getElementById('companyName').value;
    const cnpj = document.getElementById('cnpj').value.replace(/[^\d]/g, ''); // Remove pontos, traços e barra

    if (!companyName || !cnpj) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const cleanCompanyName = companyName.replace(/\s+/g, '').toLowerCase();
    const cdswebUser = cleanCompanyName;
    const cdswebPass = `${cleanCompanyName}@${cnpj.slice(0, 4)}`;
    const odbcUser = `${cleanCompanyName}${cnpj}`;
    const odbcPass = generateRandomPassword(8);
    const databaseName = formatDatabaseName(companyName);

    const output = `
CDSWEB
User:  ${cdswebUser}
Pass:  ${cdswebPass}

ODBC
User:  ${odbcUser}
Pass:  ${odbcPass}
Banco:  ${databaseName}
IP: 216.245.218.2,4504
    `;

    document.getElementById('resultado').value = output.trim();
    document.getElementById('copyButton').style.display = 'inline';
}

function copyToClipboard() {
    const outputText = document.getElementById('resultado').value;
    navigator.clipboard.writeText(outputText).then(function() {
        showAlert();
    }, function(err) {
        console.error('Erro ao copiar texto: ', err);
    });
}

function showAlert() {
    const alertBox = document.getElementById('alerta');
    alertBox.style.display = 'block';
    setTimeout(function() {
        alertBox.style.display = 'none';
    }, 10000);
}

function closeAlert() {
    const alertBox = document.getElementById('alerta');
    alertBox.style.display = 'none';
}
