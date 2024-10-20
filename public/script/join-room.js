const t_form = document.querySelector('.join-room-form');
const t_join_room_id_input = document.querySelector('.join-room-id-input');

const t_message = document.querySelector('.join-room-message');

t_form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = t_join_room_id_input.value;
    const joiner = client_data.admin._id;

    if(!id) {
        t_message.style.color = 'red';
        t_message.style.background = 'black';
        t_message.innerText = "Hãy điền ID của Room bạn muốn tham gia";
        return;
    }

    fetch('/room/join-room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: joiner,
            room_id: id
        })
    })
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                t_message.style.color = 'red';
                t_message.style.background = 'black';
                t_message.innerText = data.message;
                return;
            } else {
                t_message.style.color = 'green';
                t_message.style.background = 'yellow';
                t_message.innerText = "Tham gia phòng thành công";

            }
            // Kích hoạt sự kiện join-room-success của dom khi tham gia phòng
            const join_room_success_event = new CustomEvent('join-room-success', {
                detail: {
                    new_room_data: data
                }
            })
            document.dispatchEvent(join_room_success_event);
            
            console.log(data);
        })

    // Reset giá trị trong các thẻ input
    t_join_room_id_input.value = '';
})