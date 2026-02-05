const commandInput = document.getElementById('command-input');
const historyContainer = document.getElementById('history');
const terminalBody = document.getElementById('terminal-body');
const lastLoginSpan = document.getElementById('last-login-time');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Set last login time
lastLoginSpan.innerText = new Date().toLocaleString();

// Theme Setup
const currentTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

const COMMANDS = {
    help: () => `
Available commands:
  <span class="highlight">about</span>      - Professional background
  <span class="highlight">skills</span>     - Technical expertise
  <span class="highlight">projects</span>   - Featured work
  <span class="highlight">contact</span>    - Connect with me
  <span class="highlight">clear</span>      - Clear terminal
  <span class="highlight">whoami</span>     - Current session info
  <span class="highlight">sudo</span>       - ??
    `,
    about: () => `
I am <span class="highlight">Sai Santosh</span>, a Data Research Lead at <a href="https://factly.in" target="_blank" class="link">Factly</a>.
In my role as Team Lead, I am responsible for supervising metadata management, collaborative data cleaning, and research activities related to public/government data.

<span class="highlight">Key Responsibilities:</span>
• Discovering, transforming, and cleansing publicly available datasets.
• Creating comprehensive data dictionaries for better information accessibility.
• Facilitating the RTI (Right to Information) process with the Government of India.
• Standardizing and validating datasets for accuracy and interoperability.

Visit our data platform: <a href="https://dataful.in" target="_blank" class="link">dataful.in</a>
    `,
    skills: () => `
<span class="highlight">Technical Arsenal:</span>
  • <span class="highlight">Languages:</span> Python, SQL, Javascript
  • <span class="highlight">Data Analysis:</span> Pandas, NumPy, Advanced Excel
  • <span class="highlight">Visualization:</span> Dash, Plotly, Matplotlib, Seaborn
  • <span class="highlight">Domains:</span> Public Policy, Automotive Trends, CSR Analysis
  • <span class="highlight">Specialties:</span> NLP, Statistics, Metadata Management
    `,
    projects: () => `
<span class="highlight">Featured Projects:</span>

1. <span class="highlight">2024 Loksabha Elections</span>
   Data analysis and insights for the 2024 Indian General Elections.
   <span class="link" onclick="window.open('https://github.com/saisantoshv3/2024_loksabha_elections', '_blank')">View Repo</span>

2. <span class="highlight">Electoral Bonds Analysis</span>
   Comprehensive analysis of political funding via electoral bonds in India.
   <span class="link" onclick="window.open('https://github.com/saisantoshv3/electoral_bonds', '_blank')">View Repo</span>

3. <span class="highlight">My Rill Project</span>
   Business intelligence and fast data modeling using Rill.
   <span class="link" onclick="window.open('https://github.com/saisantoshv3/my_rill_project', '_blank')">View Repo</span>

4. <span class="highlight">COVID-19 India Tracker</span>
   Historical data tracking and visualization of the pandemic in India.
   <span class="link" onclick="window.open('https://github.com/saisantoshv3/covid-19-india', '_blank')">View Repo</span>

5. <span class="highlight">Rill Dashboards IIMT</span>
   Advanced data visualization dashboards created for IIMT.
   <span class="link" onclick="window.open('https://github.com/saisantoshv3/rill_dashboards_iimt', '_blank')">View Repo</span>
    `,
    contact: () => `
<span class="highlight">Connect:</span>
  • <span class="highlight">Email:</span> <a href="mailto:saisantoshv3@gmail.com" class="link">saisantoshv3@gmail.com</a>
  • <span class="highlight">GitHub:</span> <a href="https://github.com/saisantoshv3" target="_blank" class="link">github.com/saisantoshv3</a>
  • <span class="highlight">LinkedIn:</span> <a href="https://linkedin.com/in/saisantoshv" target="_blank" class="link">linkedin.com/in/saisantoshv</a>
    `,
    whoami: () => `guest@saisantosh-portfolio`,
    clear: () => {
        historyContainer.innerHTML = '';
        return null;
    },
    sudo: () => `Permission denied: You are not in the sudoers file. This incident will be reported.`,
    error: (cmd) => `<span class="error-text">Command not found: ${cmd}</span>. Type 'help' for available commands.`
};

// Handle Input
commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const inputBuffer = commandInput.value.trim();
        if (inputBuffer) {
            processCommand(inputBuffer);
        }
        commandInput.value = '';
        commandInput.style.width = '1px';
    }
});

commandInput.addEventListener('input', () => {
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.whiteSpace = 'pre';
    span.style.font = window.getComputedStyle(commandInput).font;
    span.innerText = commandInput.value;
    document.body.appendChild(span);
    commandInput.style.width = (span.offsetWidth + 2) + 'px';
    document.body.removeChild(span);
});

// Focus input on click anywhere
document.addEventListener('click', () => {
    commandInput.focus();
});

function processCommand(inputBuffer) {
    const commandLine = document.createElement('div');
    commandLine.className = 'command-line';
    commandLine.innerHTML = `<span class="prompt">guest@saisantosh:~$</span> <span>${inputBuffer}</span>`;
    historyContainer.appendChild(commandLine);

    const parts = inputBuffer.toLowerCase().split(' ');
    const cmd = parts[0];

    let responseText = '';

    if (COMMANDS[cmd]) {
        responseText = COMMANDS[cmd]();
    } else {
        responseText = COMMANDS.error(cmd);
    }

    if (responseText !== null) {
        const responseDiv = document.createElement('div');
        responseDiv.className = 'response';
        responseDiv.innerHTML = responseText;
        historyContainer.appendChild(responseDiv);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
}
