document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;

    // ここでフォームデータを送信する処理を実装します
    // 例: サーバーへのAjaxリクエストなど

    console.log('送信されたデータ:', { name, email, message });
    alert('お問い合わせありがとうございます。メッセージが送信されました。');

    // フォームをリセット
    this.reset();
});