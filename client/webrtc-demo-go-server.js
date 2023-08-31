function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function decodeDatachannelMessage(data) {
  const decoder = new TextDecoder();
  const arr = new Uint8Array(data);
  console.log("data: ", data);
  console.log("arr: ", arr);
  console.log("decoder.decode(arr) : ", decoder.decode(arr));
  const json = JSON.parse(decoder.decode(arr));
  console.log("Got transcript:", json);
  // updateTranscriptions(json.TranscribedText + json.CurrentTranscription);
}

class Client {
  constructor(stream) {
    let configuration;
    // (async () => {
    //   const response = await fetch(
    //     "https://matherium.metered.live/api/v1/turn/credentials?apiKey=138fc64d454a71ed6ba214fdca0ce0fcf5b0"
    //   );
    //   const iceServers = await response.json();
    //   console.log("ice servers!!!!: ",iceServers);
    //   configuration = {
    //     iceServers: iceServers,
    //   };
    // })();
    configuration = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
    this.stream = stream;

    // Publish
    this.pub = new RTCPeerConnection(configuration);
    this.pubAns = false;
    this.pubCandidates = [];
    this.pub.onicecandidate = (e) => {
      const { candidate } = e;
      if (candidate) {
        console.log("[pub] ice candidate", JSON.stringify(candidate));
        if (this.pubAns) {
          this.trickle(candidate, 0);
        } else {
          this.pubCandidates.push(candidate);
        }
      }
    };

    this.pub.onconnectionstatechange = (e) => {
      const { connectionState } = this.pub;
      console.log("[pub] connstatechange", connectionState);
    };

    // Subscribe

    this.sub = new RTCPeerConnection(configuration);
    this.subOff = false;
    this.subCandidates = [];
    this.sub.onicecandidate = (e) => {
      const { candidate } = e;
      if (candidate) {
        console.log("[sub] ice candidate", JSON.stringify(candidate));
        this.trickle(candidate, 1);
      }
    };

    this.sub.onconnectionstatechange = (e) => {
      const { connectionState } = this.sub;
      console.log("[sub] connstatechange", connectionState);
    };

    this.sub.ontrack = (e) => {
      console.log("houston we have a track", e);
      if (e.track.kind === "audio") {
        const audioEl = document.getElementById("remoteAudio");
        audioEl.srcObject = e.streams[0];
        console.log(e.streams[0].getAudioTracks());
      }
    };
    this.sub.ondatachannel = (e) => {
      const { channel } = e;
      console.log("got chan", channel);
      if (channel.label === "transcriptions") {
        channel.onmessage = (msg) => {
          console.log("msg.data: ", msg.data);
          // decodeDatachannelMessage(msg.data);
        };
      }
    };
  }

  async socketConnect() {
    return new Promise((resolve) => {
      // CHANGED THE RTC SERVER URL HERE
      let url = "wss://matherium.com/go-server";
      this.socket = new WebSocket(url);

      // Event listener for when the WebSocket connection is opened
      this.socket.addEventListener("open", (event) => {
        setInterval(() => {
          this.socket.send("");
        }, 1000);
        console.log("WebSocket connection opened");
        resolve();
      });

      // Event listener for when a message is received over the WebSocket
      this.socket.addEventListener("message", async (event) => {
        const data = JSON.parse(event.data);
        console.log(`WebSocket message received: ${data}`, data);
        const { result } = data;
        if (result) {
          if (result.type === "answer") {
            console.log("setting ans");
            await this.pub.setRemoteDescription(data.result);
            this.pubAns = true;
            this.pubCandidates.forEach((candidate) => {
              this.trickle(candidate, 0);
            });
          }
        } else {
          const { method, params } = data;
          if (method) {
            if (method === "trickle") {
              if (params.target === 0) {
                console.log("adding candidate for pub");
                await this.pub.addIceCandidate(params.candidate);
              }
              if (params.target === 1) {
                console.log("adding candidate for sub");
                if (!this.subOff) {
                  this.subCandidates.push(params.candidate);
                } else {
                  await this.sub.addIceCandidate(params.candidate);
                }
              }
            } else if (method === "offer") {
              console.log("setting offer");
              await this.sub.setRemoteDescription(params);
              const answer = await this.sub.createAnswer();
              await this.sub.setLocalDescription(answer);
              this.answer(answer);
              this.subOff = true;
              for (const candidate of this.subCandidates) {
                await this.sub.addIceCandidate(candidate);
              }
            }
          }
        }
      });

      // Event listener for when the WebSocket connection is closed
      this.socket.addEventListener("close", (event) => {
        console.log("WebSocket connection closed");
      });

      // Event listener for errors that occur on the WebSocket
      this.socket.addEventListener("error", (event) => {
        console.log(`WebSocket error: ${event}`);
      });

      // function noop() {}

      // setInterval(() => {
      //   this.socket.send('');
      // }, 1000);
    });
  }

  async join() {
    await this.socketConnect();
    const join = {
      sid: this.room,
      uid: generateRandomString(10),
      config: {},
    };
    const msg = {
      method: "join",
      params: join,
    };

    if (this.stream) {
      console.log(this.stream);
      this.stream.getTracks().forEach((track) => {
        this.pub.addTransceiver(track);
      });
    }

    const offer = await this.pub.createOffer();
    await this.pub.setLocalDescription(offer);

    msg.params.offer = offer;

    this.socket.send(JSON.stringify(msg));
  }

  trickle(candidate, target) {
    const msg = {
      method: "trickle",
      params: {
        target,
        candidate,
      },
    };

    this.socket.send(JSON.stringify(msg));
  }
  answer(answer) {
    console.log("answer", JSON.stringify(answer));
    this.socket.send(
      JSON.stringify({ method: "answer", params: { desc: answer } })
    );
  }
}

const openMediaDevices = async (constraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};

function init() {
  const callBtn = document.querySelector("#call-btn");
  callBtn.addEventListener("click", async () => {
    const stream = await openMediaDevices({ video: false, audio: true });
    console.log("stream:", stream);
    console.log(stream.getTracks());

    const client = new Client(stream);

    await client.join();
  });
}

init();

