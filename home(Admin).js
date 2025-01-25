document.getElementById('whatsapp-button').addEventListener('click', function() {
    const selectedPerson = document.getElementById('person-select').value;
    if (selectedPerson) {
        const message = encodeURIComponent("Hello, I would like to discuss...");
        window.open(`https://wa.me/${selectedPerson}?text=${message}`, '_blank');
    } else {
        alert("Please select a person to contact.");
    }
});

const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');

chatbotSend.addEventListener('click', () => {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
        appendMessage('You', userMessage);
        chatbotInput.value = '';
        generateResponse(userMessage);
    }
});

function appendMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${sender}: ${message}`;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function generateResponse(userMessage) {
    let response = "Sorry, I didn't understand that. I just can give you instruct of this repository.";
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hai') || lowerCaseMessage.includes('hi')) {
        response = "Hello! How can I assist you with the QIU FYP repository?";
    } else if (userMessage.toLowerCase().includes('submit')) {
        response = "To submit an FYP, please go to the 'Submit' section of the site.";
    } else if (lowerCaseMessage.includes('search') || lowerCaseMessage.includes('view')) {
        response = "To view an FYP, please go to the 'Search' section of the site.";
    } else if (lowerCaseMessage.includes('about')) {
        response = "To Find about university, please go to the 'About' section of the site.";
    } else if (lowerCaseMessage.includes('mark') || lowerCaseMessage.includes('moderator') || lowerCaseMessage.includes('supervisor')) {
        response = "To Mark an FYP, please go to the 'Mark' section of the site.";
    }
    setTimeout(() => appendMessage('AI', response), 1000);
}
