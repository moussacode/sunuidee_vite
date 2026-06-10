
import { gsap } from "gsap"
import { hideFormLoader, showFormLoader, validateForm } from "./utils/validation"; 
import { client } from "./api/supabase";
import { showToast } from "./ui/toast";
import { detectCategorie } from "./service/aiService";
import { createIdee } from "./service/ideeService";
import { initFilters, mettreAJourListeIdees } from "./ui/dom";
import { chargerIdees } from "./ui/dom";
import { state } from "./store/state";

const modal = document.getElementById('modal');
const ouvrirModal = document.getElementById("ajouter-idee-btn")
const fermerModal = document.getElementById("fermer-modal")
const formulaire = document.getElementById("idee-form")
const titreInput = document.getElementById("idee-titre")
const descriptionInput = document.getElementById("idee-description")
const deleteAll = document.getElementById("all_delete")
const buttons = document.querySelectorAll(".filter-btn");

titreInput.addEventListener("input", validateForm);
descriptionInput.addEventListener("input", validateForm);


initFilters(buttons, state, mettreAJourListeIdees);

// Ouverture et Fermeture du modal
ouvrirModal.addEventListener('click', () => {
    modal.classList.remove('hidden')
    gsap.from(".modal-content", {
        scale: 0.7,
        opacity: 0,
        duration: 0.4,
        ease: "back.out(1.7)"
    });
})

deleteAll.addEventListener('click', async() => {
    const confirmDelete = confirm("Tout supprimer ?");
  if (!confirmDelete) return;

  const { error } = await client
    .from("sunuidee")
    .delete()
    .gt("id", 0);

  if (error) {
    console.error(error);
    return;
  }

  showToast("Tout supprimé", "error");

  await chargerIdees();

});

fermerModal.addEventListener('click', () => {
    modal.classList.add('hidden')
    formulaire.reset()
})

//Ajout de Idee

const ajoutIdee = async () => {
  const titre = titreInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!titre || !description) {
    showToast("Champs requis", "error");
    return;
  }

  try {
    const categorie = await detectCategorie(titre, description);

    const { error } = await createIdee(client, {
      titre,
      description,
      categorie
    });

    if (error) throw error;

    await chargerIdees();

    showToast("Idée ajoutée", "success");

  } catch (error) {
    console.error(error);
    showToast("Erreur serveur", "error");
  }
};

const modifierIdee = async () => {
    const { error } = await client
    .from("sunuidee")
    .update({
      titre: titreInput.value.trim(),
      description: descriptionInput.value.trim(),
    })
    .eq("id", state.editId);

  if (error) {
    console.error(error);
    return;
  }

  state.editId = null;

  showToast("Idée modifiée", "success");

  await chargerIdees();
};


document.addEventListener("DOMContentLoaded", () => {
  chargerIdees();
});



formulaire.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    showToast("Formulaire invalide", "error");
    return;
  }

  showFormLoader();

  try {
    if (state.editId === null) {
      await ajoutIdee();
    } else {
      await modifierIdee();
    }

    formulaire.reset();
    modal.classList.add("hidden");

  } catch (err) {
    console.error(err);
    showToast("Erreur serveur", "error");
  } finally {
    hideFormLoader();
  }
});