
const apiKey = 'AIzaSyAG7MzCaKi6C_fiyei5vvukLx3mDogkHhA';
let genAI = null;
let model = null;
let generationConfig = {
  temperature: 1
};

const inputPrompt = document.querySelector('#input-prompt');
const buttonPrompt = document.querySelector('#button-prompt');
const elementResponse = document.querySelector('#response');
const elementLoading = document.querySelector('#loading');
const elementError = document.querySelector('#error');
const sliderTemperature = document.querySelector('#temperature');
const labelTemperature = document.querySelector('#label-temperature');

// Initialize model with generation configuration
function initModel(generationConfig) {
    if (typeof GoogleGenerativeAI === 'undefined') {
      console.error("GoogleGenerativeAI library not loaded.");
      return;
    }
    const safetySettings = [
      {
        category: GoogleGenerativeAI.default.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: GoogleGenerativeAI.default.HarmBlockThreshold.BLOCK_NONE
      }
    ];
  
    if (!GoogleGenerativeAI.default.HarmCategory || !GoogleGenerativeAI.default.HarmBlockThreshold) {
      console.error("Safety categories or thresholds not available in the library.");
      return;
    }

    genAI = new GoogleGenerativeAI.default.GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings,
      generationConfig
    });
    return model;
  }

// Function to run prompt with model
async function runPrompt(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (e) {
    console.error('Prompt failed', e);
    throw e;
  }
}

// Event listeners for prompt and temperature input
sliderTemperature.addEventListener('input', (event) => {
  labelTemperature.textContent = event.target.value;
  generationConfig.temperature = event.target.value;
});

inputPrompt.addEventListener('input', () => {
  if (inputPrompt.value.trim()) {
    buttonPrompt.removeAttribute('disabled');
  } else {
    buttonPrompt.setAttribute('disabled', '');
  }
});

buttonPrompt.addEventListener('click', async () => {
  const prompt = inputPrompt.value.trim();
  showLoading();
  try {
    initModel(generationConfig);
    const response = await runPrompt(prompt);
    showResponse(response);
  } catch (e) {
    showError(e);
  }
});

// Helper functions to show/hide elements
function showLoading() {
  hide(elementResponse);
  hide(elementError);
  show(elementLoading);
}

function showResponse(response) {
  hide(elementLoading);
  show(elementResponse);
  elementResponse.textContent = '';
  const paragraphs = response.split(/\r?\n/);
  paragraphs.forEach((paragraph, index) => {
    if (paragraph) {
      elementResponse.appendChild(document.createTextNode(paragraph));
    }
    if (index < paragraphs.length - 1) {
      elementResponse.appendChild(document.createElement('BR'));
    }
  });
}

function showError(error) {
  show(elementError);
  hide(elementResponse);
  hide(elementLoading);
  elementError.textContent = error;
}

function show(element) {
  element.removeAttribute('hidden');
}

function hide(element) {
  element.setAttribute('hidden', '');
}