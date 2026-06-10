import { state } from "../store/state";
import { showToast } from "../ui/toast";
import { validateForm } from "../utils/validation";
const titreInput = document.getElementById("idee-titre")
const descriptionInput = document.getElementById("idee-description")


titreInput.addEventListener("input", validateForm);
descriptionInput.addEventListener("input", validateForm);

export const createIdee = async (client, data) => {
  return await client.from("sunuidee").insert([data]);
};

export const supprimerIdee = async(id) => {
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

export const editIdee = (id) => {
    state.editId = id;

    const idee = state.idees.find(i => i.id === id);

    modal.classList.remove("hidden");

    titreInput.value = idee.titre;
    descriptionInput.value = idee.description;
};