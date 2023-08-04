let monacoEditor;
let selectedLanguage = "javascript";
let url = `http://localhost:8080`
require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {
  monacoEditor = monaco.editor.create(document.getElementById("editor"), {
    value: "",
    language: "javascript",
    theme: "vs-dark",
  });
});

document.getElementById("languageSelect").addEventListener("change", (e) => {
  selectedLanguage = e.target.value;
});

document
  .getElementById("qualityCheckBtn")
  .addEventListener("click", async () => {
    const inputCode = monacoEditor.getValue();
    try {
      // Perform quality check
      await performQualityCheck(inputCode, selectedLanguage);
      console.log("Quality check completed.");
    } catch (error) {
      console.error("Quality check failed:", error.message);
    }
  });

document.getElementById("debugBtn").addEventListener("click", async () => {
  const inputCode = monacoEditor.getValue();
  try {
    // Perform debugging
    await debugCode(inputCode);
    console.log("Debugging completed.");
  } catch (error) {
    console.error("Debugging failed:", error.message);
  }
});

document.getElementById("convertBtn").addEventListener("click", async () => {
  const inputCode = monacoEditor.getValue();
  try {
    const response = await fetch(`${url}/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceCode: inputCode,
        sourceLanguage: "javascript",
        targetLanguage: document.getElementById("languageSelect").value,
      }),
    });

    if (!response.ok) {
      throw new Error("Error converting code");
    }

    const data = await response.json();
 
    if (data && data.data) {
      const convertedCode = data.data;
      document.getElementById("outputCode").textContent = convertedCode;
    } else {
      throw new Error("Conversion response is invalid");
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
  }
});

async function performQualityCheck(code, language) {
  try {
    const response = await fetch(`${url}/correctCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });

    const data = await response.json()
    console.log(data)
   const convertedCode = data.correctedCode;
;
   document.getElementById("outputCode").textContent = convertedCode;

    if (!response.ok) {
      throw new Error("Quality check failed.");
    }
  } catch (error) {
    throw new Error("Quality check failed.");
  }
}

async function debugCode(code) {
  try {
    const response = await fetch(`${url}/debugCode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
      }),
    });

 const data = await response.json();
 console.log(data);
 const convertedCode = data.debuggingSuggestions;
 document.getElementById("outputCode").textContent = convertedCode;

    if (!response.ok) {
      throw new Error("Debugging failed.");
    }
  } catch (error) {
    throw new Error("Debugging failed.");
  }
}
