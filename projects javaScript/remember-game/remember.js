const accessKey = "Tux0jIMC6UXaLx6Wy29pZCzR7FejF6-TqxoUGCM4XYM";
const audio = document.getElementById("audio");
const numPairs = 9;
let isActive = false;
let isSoundOn = true;

getImages();

async function getImages() {
    const response = await fetch(`https://api.unsplash.com/photos/random?count=${numPairs}&query=animals&client_id=${accessKey}`);
    const data = await response.json();
    let images = data.map(image => image.urls.small);
    let imagesArr = images.concat(images);
    imagesArr.sort(() => Math.random() - 0.5);
    buildBoard(imagesArr);
}

function buildBoard(imagesArr) {
    let bordGame = document.getElementById("bord-game");
    bordGame.innerHTML = "";

    imagesArr.forEach((imageUrl) => {
        let card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">
                    <img src="${imageUrl}" alt="animal"/>
                </div>
            </div>
        `;

        bordGame.appendChild(card);

        card.addEventListener("click", () => {
            if (isActive || card.classList.contains("openCard") || card.classList.contains("cardMatch")) return;

            card.classList.add("openCard");

            const allOpenCard = document.querySelectorAll(".openCard");
            const openCards = Array.from(allOpenCard).filter(card => !card.classList.contains("cardMatch"));

            if (openCards.length === 2) {
                isActive = true;
                const img1 = openCards[0].querySelector("img").src;
                const img2 = openCards[1].querySelector("img").src

                setTimeout(() => {
                    if (img1 === img2) {
                        openCards[0].classList.add("cardMatch");
                        openCards[1].classList.add("cardMatch");
                        playSound("./sounds/correctAnswer.mp3")
                    } else {
                        playSound("./sounds/wrongAnswer.mp3")

                    }

                    openCards[0].classList.remove("openCard");
                    openCards[1].classList.remove("openCard");

                    const matchedCards = document.querySelectorAll(".cardMatch");
                    if (matchedCards.length === imagesArr.length) {
                        playSound("./sounds/success.mp3")
                        Swal.fire({
                            title: 'כל הכבוד! הצלחת להתאים את כל הקלפים 🎉',
                            text: "רוצה לנסות שוב?",
                            icon: 'success',
                            showCancelButton: true,
                            confirmButtonText: 'נסה שוב',
                            cancelButtonText: 'סגור'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload();
                            }
                        });
                    }

                    isActive = false;
                }, 900);
            }
        });
    })
};

function playSound(audioFilePath) {
    if (!isSoundOn) return;

    const sound = new Audio(audioFilePath);
    sound.play();
}

document.getElementById('btn').addEventListener('click', () => {
    location.reload();
})

audio.addEventListener("click", () => {
    isSoundOn = !isSoundOn;
    audio.src = isSoundOn ? "./images/volume-up-fill.svg" : "./images/volume-mute-fill.svg";
});