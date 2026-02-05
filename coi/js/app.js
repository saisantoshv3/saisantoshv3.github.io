const constitutionalData = {
    "preamble": "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship; EQUALITY of status and of opportunity; and to promote among them all FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation...",
    "fundamental rights": "Fundamental Rights are enshrined in Part III of the Constitution (Articles 12-35). They include:\n1. Right to Equality\n2. Right to Freedom\n3. Right against Exploitation\n4. Right to Freedom of Religion\n5. Cultural and Educational Rights\n6. Right to Constitutional Remedies.",
    "fundamental duties": "Fundamental Duties are defined in Article 51A (Part IVA). They include respecting the National Flag, the Constitution, and protecting the sovereignty, unity, and integrity of India.",
    "article 1": "Article 1 states: 'India, that is Bharat, shall be a Union of States.'",
    "article 21": "Article 21: Protection of Life and Personal Liberty. 'No person shall be deprived of his life or personal liberty except according to procedure established by law.'",
    "article 32": "Article 32 is known as the 'Heart and Soul of the Constitution'. It provides the Right to Constitutional Remedies, allowing citizens to move the Supreme Court for enforcement of rights.",
    "dr ambedkar": "Dr. B.R. Ambedkar was the Chairman of the Drafting Committee and is known as the 'Father of the Indian Constitution'.",
    "adoption": "The Constitution of India was adopted on 26th November 1949 and came into effect on 26th January 1950 (Republic Day).",
    "parts": "The original Constitution had 22 parts and 8 schedules. Currently, it has about 25 parts and 12 schedules.",
    "articles": "The original Constitution had 395 Articles. Today, it has more than 448 Articles due to various amendments."
};

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const themeToggle = document.getElementById('theme-toggle');
const typingIndicator = document.getElementById('typing-indicator');

function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = `<i class="fas fa-${isUser ? 'user' : 'robot'}"></i>`;

    const content = document.createElement('div');
    content.className = 'content';
    content.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(content);
    chatContainer.appendChild(msgDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function handleResponse(query) {
    const q = query.toLowerCase();
    let response = "I'm still learning about all the articles. You can ask me about the Preamble, Fundamental Rights, Articles (1, 21, 32), or Dr. Ambedkar.";

    for (const key in constitutionalData) {
        if (q.includes(key)) {
            response = constitutionalData[key];
            break;
        }
    }

    typingIndicator.style.display = 'flex';
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Simulate network delay
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        addMessage(response);
    }, 1000);
}

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = '';
    handleResponse(text);
}

function sendQuickMessage(text) {
    userInput.value = text;
    sendMessage();
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const icon = themeToggle.querySelector('i');
    icon.className = document.body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
});

// Window global for onclick handlers
window.sendQuickMessage = sendQuickMessage;
