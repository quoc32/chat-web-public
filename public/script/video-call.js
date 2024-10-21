document.addEventListener('turn-on-video-call', (e) => {
    e.preventDefault();

    console.log('call video event');
    alert('Tính năng đang được phát triển.')
})

// -----------------------
function openCallWindow() {
    const callWindow = window.open(
        'https://youtube.com', // URL của ứng dụng gọi điện
        'CallWindow', // Tên của cửa sổ
        'width=600,height=400,menubar=no,location=no,resizable=yes,scrollbars=yes,status=no' // Các tùy chọn cho cửa sổ
    );

    if (callWindow) {
        callWindow.focus(); // Đưa cửa sổ mới lên trên nếu nó được mở thành công
    } else {
        alert('Cửa sổ mới không thể mở. Vui lòng kiểm tra trình duyệt của bạn.');
    }
}