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


async function getSongs(folder){
  currentFolder = folder;
  let artist = currentFolder.split("/")[1].replaceAll("_"," ");
    let fetcher = await fetch(`${folder}/allSongs`);
    let response  = await fetcher.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index<as.length; index++) {
        const element =as[index];
        if(element.href.endsWith(".mp3")){
          console.log(element.href.split(`/allSongs/`)[1]);
            songs.push(element.href.split(`/allSongs/`)[1]);
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
      
        songUL.innerHTML+= 
          `<li>
              <img class="invert" src="img/music.svg" alt="music" />
              <div class="info">
                <div>${song.replaceAll("%20"," ").slice(0,-4)}</div>
                <div>Singer: ${artist.replaceAll("%20"," ")}</div>
              </div>
              <div class="playnow">
                <img class="invert" src="img/play.svg" alt="" />
              </div>
            </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
      e.addEventListener("click",element=>{
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim()+".mp3")
      })
    })
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
    let fetcher = await fetch(`songs/`);
    let response  = await fetcher.text();
    let folder;
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
    if(e.href.includes("/songs")){
      folder = e.href.split("/").slice(-2)[0];
      let a = await fetch(`songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML+=`
      <div data-folder="${folder}" class="card weight400">
          <div class="play">
            <img src="img/play.svg" alt="Play Button" />
          </div>
          <img src="songs/${folder}/cover.jpg" alt="Angry_Mood" />
          <div class="musicDescription">
            <h4 class="weight700">${response.title}</h4>
            <p>${response.description}</p>
          </div>
      </div>`
      }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => { 
      e.addEventListener("click", async item => {
          songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
          playMusic(songs[0]);
      })
  })

}

async function main(){
    await getSongs("songs/Arijit_Singh");
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
     
      let index = songs.indexOf(currentSong.src.split("/allSongs/")[1]);
      console.log(currentSong.src.split("/songs/")[1], index) 
      if(index-1<0){
        let indexToPlay = songs.length-1;
        playMusic(songs[indexToPlay]);
      }
      else{
        let indexToPlay = index-1;
        playMusic(songs[indexToPlay]);
      }
    })

    next.addEventListener("click",()=>{
      let index = songs.indexOf(currentSong.src.split("/allSongs/")[1]);
      console.log(currentSong.src.split("/allSongs/")[1], index) 
      if(index+1>=songs.length){
        let indexToPlay = 0;
        playMusic(songs[indexToPlay]);
      }
      else{
        let indexToPlay = index+1;
        playMusic(songs[indexToPlay]);
      }
    })


    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input",e=>{
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