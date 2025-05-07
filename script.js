const apiKey = 'sk_cef3783b2f470f6c288c07e39fad91142e7f8dcedec1d307'; //API KEY 입력  
const voiceId = 'ID'; // voice id 입력

// 선택된 메시지를 저장할 변수
let selectedMessage = null;

// 챗봇 메시지 추가 함수
function addMessage(text, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = text;
    
    // 메시지 클릭 이벤트 추가
    messageDiv.onclick = () => {
        // 이전에 선택된 메시지의 스타일 초기화
        const previousSelected = document.querySelector('.message.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
        
        // 현재 메시지 선택
        messageDiv.classList.add('selected');
        selectedMessage = text;
    };
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 음높이 슬라이더 이벤트 리스너
document.getElementById('pitch-slider').addEventListener('input', (e) => {
    document.getElementById('pitch-value').textContent = e.target.value;
});

// 선택된 메시지 TTS 변환
async function playSelectedMessage() {
    if (!selectedMessage) {
        alert('변환할 메시지를 선택해주세요');
        return;
    }

    const pitch = parseInt(document.getElementById('pitch-slider').value);
    const emotion = document.getElementById('emotion-select').value;
    
    await generateSpeech(selectedMessage, pitch, emotion);
}

async function generateSpeech(text, pitch = 0, emotion = 'neutral') {
  if (!text) return alert('텍스트를 입력해주세요');

  // 감정 상태에 따른 similarity_boost 값 설정
  const emotionSettings = {
    'happy': 0.9,
    'sad': 0.6,
    'angry': 0.8,
    'neutral': 0.75
  };

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg'
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: emotionSettings[emotion] || emotionSettings.neutral,
        style: 0.5,
        use_speaker_boost: true,
        speaking_rate: 1.0,
        pitch: pitch // -20.0 ~ 20.0 사이의 값
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(error);
    return alert('음성 생성 중 오류가 발생했습니다');
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = document.getElementById('audio');
  audio.src = audioUrl;
  audio.play();
}

// 챗봇 응답 예시 (실제 챗봇 연동 시 이 부분을 수정하시면 됩니다)
function simulateChatbotResponse() {
    const responses = [
        "안녕하세요! 무엇을 도와드릴까요?",
        "네, 이해했습니다. 더 자세히 말씀해 주시겠어요?",
        "그렇군요. 제가 도와드리도록 하겠습니다.",
        "좋은 질문이에요. 바로 답변해 드리겠습니다."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addMessage(randomResponse, false);
}

// 예시: 사용자 메시지 추가
addMessage("안녕하세요!", true);
setTimeout(simulateChatbotResponse, 1000);
