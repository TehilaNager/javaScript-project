const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const btn = document.querySelector('#btn');
const form = document.querySelector('form');

function isValidName(name) {
    return /^[א-תa-zA-Z\s]{2,}$/.test(name.trim());
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
    return /^\d{9,10}$/.test(phone.trim());
}

btn.addEventListener("click", (e) => {
    e.preventDefault();

    const nameVal = fullName.value;
    const emailVal = email.value;
    const phoneVal = phone.value;

    if (!nameVal || !emailVal || !phoneVal) {
        Swal.fire({
            icon: 'error',
            title: 'שגיאה',
            text: 'כל השדות המסומנים בכוכבית חייבים להיות מלאים',
            confirmButtonText: 'סגור',
            confirmButtonColor: '#d33',
        });
        return;
    }

    if (!isValidName(nameVal)) {
        Swal.fire({
            icon: 'error',
            title: 'שם לא תקין',
            text: 'אנא הזן שם מלא עם לפחות שני תווים, אותיות בלבד',
            confirmButtonText: 'סגור',
            confirmButtonColor: '#d33',
        });
        return;
    }

    if (!isValidEmail(emailVal)) {
        Swal.fire({
            icon: 'error',
            title: 'אימייל לא תקין',
            text: 'אנא הזן כתובת דוא"ל תקינה',
            confirmButtonText: 'סגור',
            confirmButtonColor: '#d33',
        });
        return;
    }

    if (!isValidPhone(phoneVal)) {
        Swal.fire({
            icon: 'error',
            title: 'טלפון לא תקין',
            text: 'אנא הזן מספר טלפון תקין עם 9-10 ספרות בלבד',
            confirmButtonText: 'סגור',
            confirmButtonColor: '#d33',
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: '!הטופס נשלח בהצלחה',
        text: '😊ניצור איתך קשר בהקדם',
        confirmButtonText: 'סגור',
        confirmButtonColor: '#3085d6',
        background: '#f0fff0',
    });

    form.reset();
});
