
const t_form = document.querySelector('.create-room-form');
const t_name_input = document.querySelector('.create-room-name-input');
const t_password_input = document.querySelector('.create-room-password-input');

const t_message = document.querySelector('.create-room-message');

t_form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = t_name_input.value;
    const password = t_password_input.value;
    const creater = client_data.admin._id;

    if(!name || !password) {
        t_message.style.color = 'red';
        t_message.style.background = 'black';
        t_message.innerText = "Hãy điền đầy đủ các trường Name và Password";
        return;
    }

    fetch('/room/create-room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            creater,
            password
        })
    })
        .then(res => res.json())
        .then(data => {
            if(data.message) {
                t_message.style.color = 'red';
                t_message.style.background = 'black';
                t_message.innerText = data.message;
            } else {
                t_message.style.color = 'green';
                t_message.style.background = 'yellow';
                t_message.innerText = "Tạo phòng thành công";

            }
            // Kích hoạt sự kiện create-room-success của dom khi tạo thành công
            const create_room_success_event = new CustomEvent('create-room-success', {
                detail: {
                    new_room_data: data
                }
            })
            document.dispatchEvent(create_room_success_event);
        })

    // Reset giá trị trong các thẻ input
    t_name_input.value = '';
    t_password_input.value = '';
})
