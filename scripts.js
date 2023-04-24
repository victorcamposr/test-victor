const video = document.querySelector('video');
const screenshot = document.getElementById('screenshot');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const sendButton = document.getElementById('sendButton');
const captureButton = document.getElementById('captureButton');
let mediaRecorder;
let recordedChunks = [];

// Configurar stream de vídeo
async function startCapture() {
    const displayMediaOptions = {
        video: {
            cursor: 'always',
        },
        audio: false,
    }

    try {
        const stream = await navigator.mediaDevices.getDisplayMedia(
            displayMediaOptions
        )
        video.srcObject = stream
        startRecording(stream)
    } catch (err) {
        console.error('Erro ao capturar vídeo:', err)
    }
}
// Iniciar gravação
function startRecording(stream) {
    recordedChunks = []
    mediaRecorder = new MediaRecorder(stream)

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data)
        }
    }

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm',
        })
        // Faça algo com o vídeo gravado, por exemplo, envie para um servidor
        sendVideo(blob)
    }

    mediaRecorder.start()
}

// Enviar vídeo para o servidor
function sendVideo(blob) {
    // Implemente a lógica para enviar o vídeo para o servidor aqui
    // Por exemplo, usando XMLHttpRequest ou Fetch API
}

// Configurar botões
startButton.onclick = () => {
    startCapture();
    startButton.disabled = true;
    stopButton.disabled = false;
    captureButton.disabled = false;
  };
  
  stopButton.onclick = () => {
    mediaRecorder.stop();
    video.srcObject.getTracks().forEach(track => track.stop());
    startButton.disabled = false;
    stopButton.disabled = true;
  };
  
  captureButton.onclick = () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const screenshotDataUrl = canvas.toDataURL('image/jpeg');
    screenshot.src = screenshotDataUrl;
    screenshot.style.display = 'block';
  };