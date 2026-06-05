
const modal = document.getElementById('modal');
const ouvrirModal = document.getElementById("ajouter-idee-btn")
const fermerModal = document.getElementById("fermer-modal")
const formulaire = document.getElementById("idee-form")
const titreInput = document.getElementById("idee-titre")
const descriptionInput = document.getElementById("idee-description")
const categorieInput = document.getElementById("idee-categorie")
const submitBtn = document.getElementById("submit-btn")
const deleteAll = document.getElementById("all_delete")
const buttons = document.querySelectorAll(".filter-btn");
const activeFiltersContainer = document.getElementById("active-filters");
const toast = document.getElementById("toast");
const formLoader = document.getElementById("form-loader");
const { createClient } = supabase;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const client = createClient(supabaseUrl, supabaseKey);

const titreError = document.getElementById("titre-error");
const descriptionError = document.getElementById("description-error");

console.log(client)
function showFormLoader() {
  formLoader.classList.remove("hidden");
  submitBtn.disabled = true;
  submitBtn.classList.add("opacity-50", "cursor-not-allowed");
}

function hideFormLoader() {
  formLoader.classList.add("hidden");
  submitBtn.disabled = false;
  submitBtn.classList.remove("opacity-50", "cursor-not-allowed");
}
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
function validateForm() {
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
titreInput.addEventListener("input", validateForm);
descriptionInput.addEventListener("input", validateForm);

// let idees = []
let editId = null;
let activeFilters = [];
let idees = []


const showToast = (message, type = "success") => {

    toast.textContent = message;
    toast.classList.remove("hidden");

    toast.className = "fixed top-5 right-5 px-6 py-3 rounded-xl text-white";

    if (type === "success") {
        toast.classList.add("bg-green-500");
    }

    if (type === "error") {
        toast.classList.add("bg-red-500");
    }

    if (type === "warning") {
        toast.classList.add("bg-yellow-500");
    }

   
    gsap.fromTo(
        toast,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
    );

    
    setTimeout(() => {

        gsap.to(toast, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                toast.classList.add("hidden");
            }
        });

    }, 2000);
};
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_KEY;

async function getCategorieFromAI(titre, description) {
  const models = [
    "deepseek/deepseek-r1",
    "mistralai/mistral-7b-instruct"
  ];

  for (let modelIa of models) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: modelIa,
          messages: [
            {
              role: "user",
              content: `
Choisis UNE catégorie parmi :
tech, campus, pedagogie, evenement.

Titre: ${titre}
Description: ${description}

Réponds uniquement par la catégorie.
`
            }
          ]
        })
      });

      if (!res.ok) throw new Error("fail");

      const data = await res.json();
      return data.choices[0].message.content.trim();

    } catch (e) {
      console.log("Erreur modèle :", modelIa);
    }
  }

  throw new Error("Aucun modèle IA disponible");
}
async function chargerIdees() {
  const { data, error } = await client
    .from("sunuidee")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  idees = data;
  mettreAJourListeIdees();
}



buttons.forEach((button) => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        if (filter === "all") {

            activeFilters = [];

            buttons.forEach(btn => {
                btn.classList.remove("bg-primary");
                btn.classList.add("bg-gray-100");
            });

            button.classList.add("bg-primary");
            mettreAJourListeIdees();

            console.log(activeFilters);
            return;
        }


        buttons.forEach(btn => {
            if (btn.dataset.filter === "all") {
                btn.classList.remove("bg-primary");
                btn.classList.add("bg-gray-100");
            }
        });

        if (activeFilters.includes(filter)) {
            activeFilters = activeFilters.filter(f => f !== filter);
        } else {
            activeFilters.push(filter);
        }

        console.log(activeFilters);

        if (activeFilters.length === 0) {

            buttons.forEach(btn => {

                if (btn.dataset.filter === "all") {

                    btn.classList.remove("bg-gray-100");
                    btn.classList.add("bg-primary");
                }
            });

        }


        button.classList.toggle("bg-primary");
        button.classList.toggle("bg-gray-100");
        mettreAJourListeIdees();

    });

});

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



const saveIdees = () => {
    localStorage.setItem('idees', JSON.stringify(idees))
}

const ajoutIdee = async () => {


    const titre = titreInput.value.trim();
    const description = descriptionInput.value.trim();

  let categorie;

  try {
    categorie = await getCategorieFromAI(titre, description);
  } catch (error) {
    showToast("IA indisponible", "warning");
    return;
  }

  const { error } = await client
    .from("sunuidee")
    .insert([
      {
        titre,
        description,
        categorie
      }
    ]);

  if (error) {
    console.error(error);
    showToast("Erreur ajout", "error");
    return;
  }

  showToast("Idée ajoutée", "success");

  await chargerIdees();

    console.log(idees)
    showToast("Idée ajoutée avec succès");


}
const modifierIdee = async () => {
    const { error } = await client
    .from("sunuidee")
    .update({
      titre: titreInput.value.trim(),
      description: descriptionInput.value.trim(),
    })
    .eq("id", editId);

  if (error) {
    console.error(error);
    return;
  }

  editId = null;

  showToast("Idée modifiée", "success");

  await chargerIdees();
};


const mettreAJourListeIdees = () => {

    const listeIdees = document.getElementById("liste-idees");

    listeIdees.innerHTML = "";


    let ideesAFficher = idees;

    if (activeFilters.length > 0) {
        ideesAFficher = idees.filter(idee =>
            activeFilters.includes(idee.categorie)
        );
    }

    if (ideesAFficher.length === 0) {

        listeIdees.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-10 text-center text-gray-500">
                <h2 class="text-xl font-medium mb-1">
                    Aucune idée trouvée
                </h2>
            </div>
        `;

        return;
    }


    ideesAFficher.forEach((idee, index) => {

        const ideeCard = document.createElement("div");

        ideeCard.innerHTML = `
           <div class="idee-card bg-card p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100"> 
           <h3 class="text-xl font-semibold text-tcard mb-3"> ${idee.titre} </h3> 
           <p class="text-secondary leading-relaxed"> ${idee.description} </p> 
           <div class="mt-5 flex justify-between items-center"> 
           <span class="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full"> ${idee.categorie} </span> 
           <div class="flex items-center gap-2"> <button class="edit p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition cursor-pointer" > 
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"> <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /> </svg> </button> 
           <button class="delete p-2 rounded-lg text-red-600 hover:bg-red-100 transition cursor-pointer"  > <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"> 
           <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /> </svg> </button> </div> 
           </div> 
           </div>
        `;

        const editBtn = ideeCard.querySelector(".edit");
        const deleteBtn = ideeCard.querySelector(".delete");

        editBtn.addEventListener("click", () => editIdee(idee.id));
        deleteBtn.addEventListener("click", () => supprimerIdee(idee.id));
        listeIdees.appendChild(ideeCard);
    });

    
};
const supprimerIdee = async(id) => {
    const confirmDelete = confirm("Supprimer cette idée ?");
  if (!confirmDelete) return;

  const { error } = await client
    .from("sunuidee")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return;
  }

  showToast("Idée supprimée", "error");

  await chargerIdees();
    
};

const editIdee = (id) => {
    editId = id;

    const idee = idees.find(i => i.id === id);

    modal.classList.remove("hidden");

    titreInput.value = idee.titre;
    descriptionInput.value = idee.description;
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
    if (editId === null) {
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