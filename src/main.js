const areaOptions = {
  PRESCHOOL: "Förskola och utbildning",
  LITERATURE: "Literatur och bibliotek",
  URBAN_DEVELOPMENT: "Stadsutveckling",
  SPORTS: "Motion och idrott",
  TRAFFIC: "Trafik och gator",
  WORK: "Arbetsliv och jobb",
  POLITICS: "Kommun och politik",
};

let selectedAreas = new Set();

window.onload = () => {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const areasSelectEl = document.getElementById("areas");
  const selectedAreasEl = document.getElementById("selected-areas");
  const submitEl = document.getElementById("submit");
  const addAreaBtnEl = document.getElementById("add-area");
  const feedbackEl = document.getElementById("feedback");
  let removeAreaBtnEls = document.querySelectorAll(".remove-area");

  // Remove an area from selected areas.
  const removeArea = (e) => {
    selectedAreas.delete(e.target.value);
    updateSelectedAreas();
  };

  // Hide already selected areas from the <select> and show them in the selected areas list instead.
  const updateSelectedAreas = () => {
    removeAreaBtnEls.forEach((removeAreaBtnEl) => {
      removeAreaBtnEl.removeEventListener("click", removeArea);
    });

    areasSelectEl.innerHTML = "";
    Object.entries(areaOptions)
      .filter(([key]) => !selectedAreas.has(key))
      .forEach(([key, value]) => {
        areasSelectEl.insertAdjacentHTML(
          "beforeend",
          `<option value='${key}'>${value}</option>`
        );
      });

    selectedAreasEl.innerHTML = "";
    Object.entries(areaOptions)
      .filter(([key]) => selectedAreas.has(key))
      .forEach(([key, value]) => {
        selectedAreasEl.insertAdjacentHTML(
          "beforeend",
          `<div class="added-area"><div value='${key}'>${value}</div><button class="remove-area" value="${key}" style="justify-self:end;" title="Ta bort ${value}">&times;</button></div>`
        );
      });
    removeAreaBtnEls = document.querySelectorAll(".remove-area");

    removeAreaBtnEls.forEach((removeAreaBtnEl) => {
      removeAreaBtnEl.addEventListener("click", removeArea);
    });
  };

  // Add an area to list of areas.
  addAreaBtnEl.addEventListener("click", () => {
    const addArea = areasSelectEl.value;
    if (addArea) {
      selectedAreas.add(areasSelectEl.value);
      updateSelectedAreas();
    }
  });

  // Submitting the email subscription
  submitEl.addEventListener("click", () => {
    nameEl.classList.remove("invalid-input");
    emailEl.classList.remove("invalid-input");
    areasSelectEl.classList.remove("invalid-input");
    feedbackEl.classList.remove(...feedbackEl.classList);
    feedbackEl.innerText = "";

    //const nameRegex = /^[\p{L}\s-]+$/u;
    const nameRegex = /^[\p{L}\s-]+[\s-]+[\p{L}\s-]+$/u;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const name = nameEl.value;
    const email = emailEl.value;

    let feedback = "";

    let ok = true;

    if (!name.match(nameRegex)) {
      nameEl.classList.add("invalid-input");
      ok = false;
      feedback += "- Namnfältet ska bestå av både för- och efternamn.\n";
    }
    if (!email.match(emailRegex)) {
      emailEl.classList.add("invalid-input");
      ok = false;
      feedback += "- E-postaddressen är inte en korrekt e-postaddress.\n";
    }
    if (selectedAreas.size === 0) {
      areasSelectEl.classList.add("invalid-input");
      ok = false;
      feedback += "- Minst ett område måste väljas.";
    }

    if (!ok) {
      feedbackEl.classList.add("text-error");
      feedback = "Anmälan misslyckades:\n" + feedback;
      feedbackEl.innerText = feedback;
    } else {
      feedbackEl.classList.add("text-success");
      feedbackEl.innerText = `Du är nu anmäld till vårt nyhetsbrev! 🎈\nNamn: ${name}\nE-post: ${email}\nOmråden: ${[
        ...selectedAreas,
      ]
        .map((area) => areaOptions[area] ?? "")
        .join(", ")}`;
    }
  });

  updateSelectedAreas();
};
