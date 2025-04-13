let currentSong = new Audio();

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


async function getSongs(){
    let fetcher = await fetch("http://127.0.0.1:3000/songs/");
    let response  = await fetcher.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index<as.length; index++) {
        const element =as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    return songs;
}

const playMusic = (music, pause=false)=>{
  currentSong.src = "/songs/"+ music;
  if(!pause){
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(music);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}
async function main(){
    let songs = await getSongs();
    playMusic(songs[0], true)
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML= songUL.innerHTML+ `<li>
                <img class="invert" src="img/music.svg" alt="music" />
                <div class="info">
                  <div>${song.replaceAll("%20"," ")}</div>
                  <div>Smit</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="img/play.svg" alt="" />
                </div>
              </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
      e.addEventListener("click",element=>{
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
      })
    })


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
      console.log(currentSong);
      console.log(songs);
      console.log(songs.indexOf(currentSong.src.split("/songs/")[1]));
      let index = songs.indexOf(currentSong.src.split("/songs/")[1]);
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
      console.log(currentSong);
      console.log(songs);
      console.log(songs.indexOf(currentSong.src.split("/songs/")[1]));
      let index = songs.indexOf(currentSong.src.split("/songs/")[1]);
      if(index+1>=songs.length){
        let indexToPlay = 0;
        playMusic(songs[indexToPlay]);
      }
      else{
        let indexToPlay = index+1;
        playMusic(songs[indexToPlay]);
      }
    })
}

main();