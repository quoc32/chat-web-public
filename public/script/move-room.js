document.addEventListener('move-room-config', event => {
    event.preventDefault();

    let rooms = document.querySelectorAll(".room"); 
    rooms.forEach((room) => {
        DragTheElement(room);
    });

    function DragTheElement(room) {
        let offsetX, offsetY;

        const drag = (e_move) => {
            room.style.top = `${e_move.clientY - offsetY}px`; 
            room.style.left = `${e_move.clientX - offsetX}px`; 
        }

        const stop = (e_up) => {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stop);
        }

        const name_header = room.querySelector('.room-name-header');

        name_header.addEventListener('mousedown', (e_down) => {
            
            // Calculate the offsets
            offsetX = e_down.clientX - room.getBoundingClientRect().left;
            offsetY = e_down.clientY - room.getBoundingClientRect().top;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stop);
        })
    }

})
