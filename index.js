let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let api = '3883fb97-28da-4cc6-af58-8bc74a3779c3';
let not_found = document.querySelector('.not_found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');

searchBtn.addEventListener('click', function (e) {
    e.preventDefault();

    // clear Data
    audioBox.innerHTML = '';
    defBox.innerHTML = '';
    not_found.innerHTML = '';

    //get data from input
    let word = input.value;
    console.log(word);
    if (word === "") {
        alert("word is required");
        return;
    }
    getData(word);
});


async function getData(word) {

    loading.style.display = 'block';
    //Ajax Call
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${api}`);
    const data = await response.json();

    if (!data.length) {
        loading.style.display = 'none';
        not_found.innerHTML = "<h2>OOps Data not found.</h2>";
        return;
    }
    // If result is suggestion
    if (typeof data[0] === "string") {
        loading.style.display = 'none';

        let search = document.querySelector("#search");
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean that?';
        not_found.appendChild(heading);

        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = element;
            not_found.appendChild(suggestion);

        });

    }

    // result found

    loading.style.display = 'none';
    let definition = data[0].shortdef[0];
    defBox.innerText = definition;

    //sound
    const SoundName = data[0].hwi.prs[0].sound.audio;
    if (SoundName) {
        loading.style.display = 'none';
        renderSound(SoundName);
    }
    function renderSound(SoundName) {
        let subFolder = SoundName.charAt(0);
        let soundSrc = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subFolder}/${SoundName}.mp3`;
        let aud = document.createElement('audio');
        aud.src = soundSrc;
        aud.controls = true;
        audioBox.appendChild(aud);
        console.log(soundSrc);
    }

    console.log(data);
}