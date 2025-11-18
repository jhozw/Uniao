// ===========================
// VALIDAÇÃO E MÁSCARAS DE INPUT
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cadastroForm');
    
    if (form) {
        // Aplicar máscaras aos inputs
        applyMasks();
        
        // Validar formulário ao enviar
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                alert('Formulário enviado com sucesso!');
                // Aqui você poderia enviar os dados para um servidor
                // form.submit();
            }
        });
    }
});

// ===========================
// FUNÇÃO: Aplicar Máscaras
// ===========================

function applyMasks() {
    const cpfInput = document.getElementById('cpf');
    const telefoneInput = document.getElementById('telefone');
    const cepInput = document.getElementById('cep');
    
    if (cpfInput) {
        cpfInput.addEventListener('input', function() {
            this.value = maskCPF(this.value);
        });
    }
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function() {
            this.value = maskTelefone(this.value);
        });
    }
    
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            this.value = maskCEP(this.value);
        });
    }
}

// ===========================
// MÁSCARAS DE INPUT
// ===========================

function maskCPF(value) {
    // Remove caracteres não numéricos
    value = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    value = value.substring(0, 11);
    
    // Aplica a máscara: 000.000.000-00
    if (value.length > 0) {
        value = value.substring(0, 3) + '.' + value.substring(3);
    }
    if (value.length > 7) {
        value = value.substring(0, 7) + '.' + value.substring(7);
    }
    if (value.length > 11) {
        value = value.substring(0, 11) + '-' + value.substring(11);
    }
    
    return value;
}

function maskTelefone(value) {
    // Remove caracteres não numéricos
    value = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    value = value.substring(0, 11);
    
    // Aplica a máscara: (11) 98765-4321
    if (value.length > 0) {
        value = '(' + value.substring(0, 2);
    }
    if (value.length > 2) {
        value = value + ') ' + value.substring(2);
    }
    if (value.length > 9) {
        value = value.substring(0, 9) + '-' + value.substring(9);
    }
    
    return value;
}

function maskCEP(value) {
    // Remove caracteres não numéricos
    value = value.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    value = value.substring(0, 8);
    
    // Aplica a máscara: 00000-000
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5);
    }
    
    return value;
}

// ===========================
// VALIDAÇÃO DE FORMULÁRIO
// ===========================

function validateForm() {
    const form = document.getElementById('cadastroForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    let isValid = true;
    
    inputs.forEach(function(input) {
        if (!validateField(input)) {
            isValid = false;
            showError(input);
        } else {
            removeError(input);
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    // Verificar se o campo é obrigatório e está vazio
    if (field.hasAttribute('required') && value === '') {
        return false;
    }
    
    // Validações específicas por tipo
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }
    
    if (field.id === 'cpf' && value !== '') {
        return validateCPF(value);
    }
    
    if (field.id === 'telefone' && value !== '') {
        return value.replace(/\D/g, '').length === 11;
    }
    
    if (field.id === 'cep' && value !== '') {
        return value.replace(/\D/g, '').length === 8;
    }
    
    if (field.type === 'date' && value !== '') {
        return !isNaN(Date.parse(value));
    }
    
    if (field.type === 'checkbox' && field.hasAttribute('required')) {
        return field.checked;
    }
    
    return true;
}

// ===========================
// VALIDAÇÃO DE CPF
// ===========================

function validateCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        return false;
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    // Calcula o primeiro dígito verificador
    let sum = 0;
    let remainder;
    
    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    
    if (remainder !== parseInt(cpf.substring(9, 10))) {
        return false;
    }
    
    // Calcula o segundo dígito verificador
    sum = 0;
    
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    
    if (remainder === 10 || remainder === 11) {
        remainder = 0;
    }
    
    if (remainder !== parseInt(cpf.substring(10, 11))) {
        return false;
    }
    
    return true;
}

// ===========================
// FUNÇÕES DE ERRO
// ===========================

function showError(field) {
    field.classList.add('error');
    
    // Remove mensagem de erro anterior se existir
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Cria e adiciona mensagem de erro
    const errorMessage = document.createElement('span');
    errorMessage.className = 'error-message';
    errorMessage.textContent = getErrorMessage(field);
    field.parentElement.appendChild(errorMessage);
}

function removeError(field) {
    field.classList.remove('error');
    
    const errorMessage = field.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function getErrorMessage(field) {
    if (field.hasAttribute('required') && field.value.trim() === '') {
        return 'Este campo é obrigatório.';
    }
    
    if (field.type === 'email') {
        return 'insira um e-mail válido.';
    }
    
    if (field.id === 'cpf') {
        return 'insira um CPF válido.';
    }
    
    if (field.id === 'telefone') {
        return 'insira um telefone válido.';
    }
    
    if (field.id === 'cep') {
        return 'insira um CEP válido.';
    }
    
    return 'Campo contém um valor inválido.';
}
