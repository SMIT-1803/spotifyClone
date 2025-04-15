let currentSong = new Audio();
let currentFolder;
let songs;

function secToMin(sec) {
  if (isNaN(sec) || sec < 0) {
    return "00:00"; // Return a default value for invalid input
  }
  const min = parseInt(Math.floor(sec / 60));
  const remainingSec = parseInt(sec % 60);
  
  // Pad with leading zeros if needed
  const mm = String(min).padStart(2, '0');
  const ss = String(remainingSec).padStart(2, '0');
  
  return `${mm}:${ss}`;
}


async function getSongs(folder) {
  currentFolder = folder;
  let res = await fetch(`${folder}/tracks.json`);
  let data = await res.json(); 
  songs = data.tracks;
  let songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";

  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img class="invert" src="img/music.svg" alt="music" />
        <div class="info">
          <div>${song.replaceAll("%20"," ").slice(0, -4)}</div>
          <div>Singer: Arijit Singh</div>
        </div>
        <div class="playnow">
          <img class="invert" src="img/play.svg" alt="" />
        </div>
      </li>
    `;
  }

  Array.from(songUL.getElementsByTagName("li")).forEach(li => {
    li.addEventListener("click", () => {
      let songTitle = li.querySelector(".info").firstElementChild.innerHTML.trim() + ".mp3";
      // console.log(songTitle);
      playMusic(songTitle);
    });
  });

  return songs;
}

const playMusic = (music, pause=false)=>{
  currentSong.src = `${currentFolder}/allSongs/`+ music;
  if(!pause){
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(music).slice(0,-4);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}

async function displayAlbums(){
    let fetcher = await fetch(`songs/songs.json`);
    let response  = await fetcher.json();
    let folder;
    let cardContainer = document.querySelector(".cardContainer");
    for (let index = 0; index < response.length; index++) {
      const obj = response[index];
      folder = obj.title;
      cardContainer.innerHTML+=`
      <div data-folder="${folder}" class="card weight400">
          <div class="play">
            <img src="img/play.svg" alt="Play Button" />
          </div>
          <img src="songs/${obj.title}/cover.jpg" alt="${obj.title}" />
          <div class="musicDescription">
            <h4 class="weight700">${obj.title}</h4>
            <p>${obj.description}</p>
          </div>
      </div>`
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => { 
      e.addEventListener("click", async item => {
          songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
          playMusic(songs[0]);
      })
  })

}

async function main(){
    let fetcher = await fetch(`songs/songs.json`);
    let response  = await fetcher.json();
    await getSongs("songs/"+response[0].title);
    playMusic(songs[0], true)

    displayAlbums();

    play.addEventListener("click",()=>{
      if(currentSong.paused){
        currentSong.play();
        play.src = "img/pause.svg";
      }
      else{
        currentSong.pause();
        play.src = "img/play.svg";
      }
    })

    currentSong.addEventListener("timeupdate",()=>{  
      document.querySelector(".songTime").innerHTML = `${secToMin(currentSong.currentTime)}  /  ${secToMin(currentSong.duration)}`
      document.querySelector(".circle").style.left = 100*(currentSong.currentTime  /  currentSong.duration)+"%";
    }) 

    document.querySelector(".seekBar").addEventListener("click",e=>{
      let percent = 100*(e.offsetX/e.target.getBoundingClientRect().width)
      document.querySelector(".circle").style.left = percent+"%";
      currentSong.currentTime = ((currentSong.duration)*percent)/100

    })


    document.querySelector(".hamburger").addEventListener("click",()=>{
      document.querySelector(".left").style.left="0";
    })

    document.querySelector(".close").addEventListener("click",()=>{
      document.querySelector(".left").style.left="-120%";
    })


    previous.addEventListener("click",()=>{  
      let prevSong;
      let index = songs.indexOf(currentSong.src.split("/allSongs/")[1].replaceAll("%20"," "));
      if(index-1<0){
        let indexToPlay = songs.length-1;
        prevSong = songs[indexToPlay];
        playMusic(prevSong);
      }
      else{
        let indexToPlay = index-1;
        prevSong = songs[indexToPlay];
        playMusic(prevSong);
      }
    })

    next.addEventListener("click",()=>{
      let nextSong;
      let index = songs.indexOf(currentSong.src.split("/allSongs/")[1].replaceAll("%20"," "));
      if(index+1>=songs.length){
        let indexToPlay = 0;
        nextSong = songs[indexToPlay];
        playMusic(nextSong);
      }
      else{
        let indexToPlay = index+1;
        nextSong = songs[indexToPlay];
        playMusic(nextSong);
      }
    })


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input",e=>{
      if(document.querySelector(".volume>img").src.includes("mute.svg")){
        document.querySelector(".volume>img").src= document.querySelector(".volume>img").src.replace("mute.svg","volume.svg");
      }
      let percent = e.target.value/100;
      currentSong.volume = percent;
    })

    document.querySelector(".volume>img").addEventListener("click",e=>{
      if(e.target.src.includes("volume.svg")){
        e.target.src= e.target.src.replace("volume.svg","mute.svg");
        currentSong.volume= 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0
      }
      else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg");
        currentSong.volume= 0.1;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10
      }
    })   
}
main();