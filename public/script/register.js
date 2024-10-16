
const t_zone = document.querySelector('.register-zone');

const t_form = document.querySelector('.register-form');

const t_name = document.querySelector('.register-input-name');
const t_email = document.querySelector('.register-input-email');
const t_password = document.querySelector('.register-input-password');

const t_mes = document.querySelector('.register-message');
t_mes.style.color = 'red';
t_mes.style.backgroundColor = 'black';

const t_btn = document.querySelector('.go-to-login');


t_form.addEventListener('submit', (e) => {
    e.preventDefault();

    t_mes.style.color = 'red';
    t_mes.style.backgroundColor = 'black';

    const name = t_name.value;
    const email = t_email.value;
    const password = t_password.value;

    if(!name || !email || !password) {
        t_mes.innerText = "Hãy điền đầy đủ các trường Name, Email và Password";
        return;
    }

    fetch('http://localhost:3000/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            email,
            password
        })
    }).then(res => {
        return res.json();
    }).then(data => {
        if(data.error) {
            t_mes.innerText = data.error;
        } else {
            t_mes.style.color = 'green';
            t_mes.style.backgroundColor = 'yellow';
            t_mes.innerText = "Đăng ký thành công, hãy đăng nhập.";
        }

    })
})


t_btn.addEventListener('click', (e) => {
    e.preventDefault();
    document.dispatchEvent(go_to_login);
})

// -------------
document.addEventListener('chat-on', () => {
    t_zone.style.display = 'none';
    t_name.value = '';
    t_email.value = '';
    t_password.value = '';
    t_mes.innerText = '';
    t_mes.style.color = 'red';
    t_mes.style.backgroundColor = 'black';
})
document.addEventListener('go-to-register', () => {
    t_zone.style.display = 'block';
})
document.addEventListener('go-to-login', () => {
    t_zone.style.display = 'none';
    t_name.value = '';
    t_email.value = '';
    t_password.value = '';
    t_mes.innerText = '';
    t_mes.style.color = 'red';
    t_mes.style.backgroundColor = 'black';
})
