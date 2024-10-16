const t_zone = document.querySelector('.login-zone');

const t_form = document.querySelector('.login-form');

const t_email = document.querySelector('.login-input-email');
const t_password = document.querySelector('.login-input-password');

const t_btn = document.querySelector('.login-btn');

const t_btn_register = document.querySelector('.go-to-register')

const t_mes = document.querySelector('.login-message');
t_mes.style.color = 'red';
t_mes.style.backgroundColor = 'black';


t_form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = t_email.value;
    const password = t_password.value;

    if(!email || !password) {
        t_mes.innerText = "Hãy điền đầy đủ các trường Email và Password";
        return;
    }

    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    }).then(res => {
        return res.json();
    }).then(data => {
        if(data.error) {
            t_mes.innerText = data.error;
        } else {
            client_data.admin = data;
            document.dispatchEvent(window.chat_on);
            console.log(client_data);
        }
    })
})

t_btn_register.addEventListener('click', (e) => {
    e.preventDefault();

    t_zone.style.display = 'none';
    t_email.value = '';
    t_password.value = '';
    t_mes.innerText = '';

    document.dispatchEvent(go_to_register);
})
// --------------
document.addEventListener('chat-on', () => {
    t_zone.style.display = 'none';
    t_email.value = '';
    t_password.value = '';
    t_mes.innerText = '';
    client_data.current_page = 'chat-page';
})
document.addEventListener('go-to-register', () => {
    t_zone.style.display = 'none';
    t_email.value = '';
    t_password.value = '';
    t_mes.innerText = '';
    client_data.current_page = 'register-page';
})
document.addEventListener('go-to-login', () => {
    t_zone.style.display = 'block';
    client_data.current_page = 'login-page';
})