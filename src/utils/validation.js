
const submitBtn = document.getElementById("submit-btn")
const titreInput = document.getElementById("idee-titre")
const descriptionInput = document.getElementById("idee-description")
const titreError = document.getElementById("titre-error")
const descriptionError = document.getElementById("description-error")
const formLoader = document.getElementById("form-loader");


function isTitreValid() {
  const value = titreInput.value.trim();

  if (value.length < 3) {
    titreError.textContent = "Le titre doit contenir au moins 3 caractères";
    titreError.classList.remove("hidden");
    titreInput.classList.add("border-red-500");
    return false;
  }

  titreError.classList.add("hidden");
  titreInput.classList.remove("border-red-500");
  titreInput.classList.add("border-green-500");

  return true;
}
function isDescriptionValid() {
  const value = descriptionInput.value.trim();

  if (value.length < 10) {
    descriptionError.textContent = "La description doit contenir au moins 10 caractères";
    descriptionError.classList.remove("hidden");
    descriptionInput.classList.add("border-red-500");
    return false;
  }

  descriptionError.classList.add("hidden");
  descriptionInput.classList.remove("border-red-500");
  descriptionInput.classList.add("border-green-500");

  return true;
}

export function showFormLoader() {
  formLoader.classList.remove("hidden");
  submitBtn.disabled = true;
  submitBtn.classList.add("opacity-50", "cursor-not-allowed");
}

export function hideFormLoader() {
  formLoader.classList.add("hidden");
  submitBtn.disabled = false;
  submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
}

export function validateForm() {
  const titreOk = isTitreValid();
  const descOk = isDescriptionValid();

  const allValid = titreOk && descOk;

  submitBtn.disabled = !allValid;

  if (allValid) {
    submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
  } else {
    submitBtn.classList.add("opacity-50", "cursor-not-allowed");
  }

  return allValid;
}