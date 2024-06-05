// cdsweb.js

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
**CDSWEB**
**User:**  ${cdswebUser}
**Pass:**  ${cdswebPass}

**ODBC**
**User:**  ${odbcUser}
**Pass:**  ${odbcPass}
**Banco:**  ${databaseName}
**IP:** 216.245.218.2,4504
    `;

    document.getElementById('resultado').value = output.trim();
    document.getElementById('copyButton').style.display = 'inline';

    // Armazena os dados gerados para uso posterior na geração do SQL
    sessionStorage.setItem('odbcUser', odbcUser);
    sessionStorage.setItem('odbcPass', odbcPass);
    sessionStorage.setItem('databaseName', databaseName);
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

function generateSQL() {
    const username = sessionStorage.getItem('odbcUser');
    const password = sessionStorage.getItem('odbcPass');
    const databaseName = sessionStorage.getItem('databaseName');

    if (!username || !password || !databaseName) {
        alert("Por favor, gere as credenciais CDSWEB primeiro.");
        return;
    }

    const sqlScript = `
-- Crie um login no SQL Server
CREATE LOGIN ${username} WITH PASSWORD = '${password}';

-- Selecione o banco de dados no qual você deseja criar o usuário
USE ${databaseName};

-- Crie um usuário para o banco de dados
CREATE USER ${username} FOR LOGIN ${username};

-- Adicione o usuário aos papéis de banco de dados necessários
EXEC sp_addrolemember 'db_accessadmin', '${username}';
EXEC sp_addrolemember 'db_datareader', '${username}';
EXEC sp_addrolemember 'db_datawriter', '${username}';
EXEC sp_addrolemember 'db_owner', '${username}';
`;

    document.getElementById('sqlOutput').value = sqlScript.trim();
    document.getElementById('copySqlButton').style.display = 'inline';
}

function copySQLToClipboard() {
    const sqlOutput = document.getElementById('sqlOutput').value;
    navigator.clipboard.writeText(sqlOutput).then(function() {
        showSQLAlert();
    }, function(err) {
        console.error('Erro ao copiar texto: ', err);
    });
}

function showSQLAlert() {
    const alertBox = document.getElementById('sqlAlert');
    alertBox.style.display = 'block';
    setTimeout(function() {
        alertBox.style.display = 'none';
    }, 10000);
}
