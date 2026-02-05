const constitutionalData = {
    "preamble": "WE, THE PEOPLE OF INDIA, having solemnly resolved to constitute India into a SOVEREIGN SOCIALIST SECULAR DEMOCRATIC REPUBLIC and to secure to all its citizens: JUSTICE, social, economic and political; LIBERTY of thought, expression, belief, faith and worship; EQUALITY of status and of opportunity; and to promote among them all FRATERNITY assuring the dignity of the individual and the unity and integrity of the Nation...",
    "fundamental rights": "Fundamental Rights are enshrined in Part III of the Constitution (Articles 12-35). They include:\n1. Right to Equality (Art. 14-18)\n2. Right to Freedom (Art. 19-22)\n3. Right against Exploitation (Art. 23-24)\n4. Right to Freedom of Religion (Art. 25-28)\n5. Cultural and Educational Rights (Art. 29-30)\n6. Right to Constitutional Remedies (Art. 32).",
    "fundamental duties": "Fundamental Duties are defined in Article 51A (Part IVA). They include respecting the National Flag, the Constitution, and protecting the sovereignty, unity, and integrity of India.",
    "article 1": "Article 1 states: 'India, that is Bharat, shall be a Union of States.'",
    "article 14": "Article 14 (Equality before law): 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.'",
    "article 19": "Article 19 (Protection of certain rights regarding freedom of speech, etc.): Guarantees all citizens the right to freedom of speech and expression, peaceful assembly, forming associations/unions, free movement, residence, and practicing any profession/trade.",
    "article 21": "Article 21 (Protection of life and personal liberty): 'No person shall be deprived of his life or personal liberty except according to procedure established by law.'",
    "article 32": "Article 32 is known as the 'Heart and Soul of the Constitution' (as called by Dr. Ambedkar). It provides the Right to Constitutional Remedies, allowing citizens to move the Supreme Court for enforcement of rights.",
    "article 44": "Article 44 (Uniform civil code for the citizens): 'The State shall endeavour to secure for the citizens a uniform civil code throughout the territory of India.'",
    "article 51a": "Article 51A (Fundamental duties): Outlines 11 duties for every citizen, including respecting the Constitution, defending the country, and scientific temper.",
    "dr ambedkar": "Dr. B.R. Ambedkar was the Chairman of the Drafting Committee and is known as the 'Father of the Indian Constitution'.",
    "adoption": "The Constitution of India was adopted on 26th November 1949 and came into effect on 26th January 1950 (Republic Day).",
    "parts": "The Constitution is divided into Parts (originally 22, now 25). Important ones:\nPart III: Fundamental Rights\nPart IV: Directive Principles\nPart IVA: Fundamental Duties\nPart V: The Union\nPart VI: The States.",
    "schedules": "There are 12 Schedules in the Constitution. For example:\n1st Schedule: States and UTs\n3rd Schedule: Oaths and Affirmations\n7th Schedule: Union, State, and Concurrent Lists\n10th Schedule: Anti-defection law.",
    "equality": "Equality is a core pillar. Article 14 ensures equality before law, Article 15 prohibits discrimination, and Article 17 abolishes untouchability.",
    "liberty": "Liberty of thought, expression, belief, faith, and worship is guaranteed in the Preamble, and Article 21 protects personal liberty.",
    "justice": "The Preamble promises Social, Economic, and Political justice to all citizens."
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
    const q = query.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    let response = "I'm still learning about all the details in the CoI.pdf. You can ask me about the Preamble, specific Articles (like 14, 19, 21, 44), Fundamental Rights, or Schedules.";

    // Sort keys by length descending to match longer phrases first
    const keys = Object.keys(constitutionalData).sort((a, b) => b.length - a.length);

    for (const key of keys) {
        if (q.includes(key)) {
            response = constitutionalData[key];
            break;
        }
    }

    // Special check for "article X" where X is a number
    const articleMatch = q.match(/article (\d+)/);
    if (articleMatch) {
        const artNum = `article ${articleMatch[1]}`;
        if (constitutionalData[artNum]) {
            response = constitutionalData[artNum];
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
