import 'webrtc-adapter';

main();

async function main(){   
    const localVideo = createVideo();
    const remoteVideo = createVideo();
    const startButton = createButton('start');
    const callButton = createButton('call');
    const hangupButton = createButton('hangup');

    let localStream: MediaStream;
    let pc1: RTCPeerConnection;
    let pc2: RTCPeerConnection;
    
    startButton.onclick = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        });
        localVideo.srcObject = stream;
        localStream = stream;
        localVideo.play();
    }

    callButton.onclick = async () => {        
        const servers = null;
        pc1 = new RTCPeerConnection(servers);        
        pc1.onicecandidate = e => (pc, event) => pc2.addIceCandidate(event.candidate);
        pc2 = new RTCPeerConnection(servers);       
        pc2.onicecandidate = e => (pc, event) => pc1.addIceCandidate(event.candidate);
        pc2.onaddstream = (e) => {
            console.log(e.stream)
            remoteVideo.srcObject = e.stream;
            remoteVideo.play();
        }
      
        pc1.addStream(localStream);

        const offer = await pc1.createOffer({
            offerToReceiveAudio: 0,
            offerToReceiveVideo: 1
        });        
        await pc1.setLocalDescription(offer);
        await pc2.setRemoteDescription(offer);
        
        const answer = await pc2.createAnswer();
        await pc2.setLocalDescription(answer);
        await pc1.setRemoteDescription(answer);
    }

    hangupButton.onclick = () => {
        pc1.close();
        pc2.close();
        pc1 = null;
        pc2 = null;
    }
}

function createVideo(){
    const video = document.createElement('video');
    video.autoplay = true;
    
    document.body.appendChild(video);
    return video;
}

function createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;

    document.body.appendChild(canvas);
    return canvas;    
}

function createButton(text: string){
    const button = document.createElement('button');
    button.textContent = text;

    document.body.appendChild(button);
    return button;
}