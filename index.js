const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const btn = document.querySelector('#btn');

btn.addEventListener("click", () => {
    if (fullName.value == "" || email.value == "" || phone.value == "") {
        Swal.fire('לא ניתן לשלוח טופס זה עם שדות ריקים');
    }
});