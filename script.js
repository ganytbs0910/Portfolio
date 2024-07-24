document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;

    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            this.reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('エラーが発生しました。もう一度お試しください。');
        });
});