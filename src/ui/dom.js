import { client } from "../api/supabase";
import { editIdee, supprimerIdee } from "../service/ideeService";
import { state } from "../store/state";

const getIdeesFiltrees = () => {
  if (state.activeFilters.length === 0) return state.idees;
  return state.idees.filter(idee => 
    state.activeFilters.includes(idee.categorie)
  );
};

const renderCarteIdee = (idee) => {
  const div = document.createElement("div");
  div.innerHTML = `
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
  div.querySelector(".edit").addEventListener("click", () => editIdee(idee.id));
  div.querySelector(".delete").addEventListener("click", () => supprimerIdee(idee.id));
  return div;
};


export const mettreAJourListeIdees = () => {
  const liste = document.getElementById("liste-idees");
  const ideesFiltrees = getIdeesFiltrees();
  
  if (ideesFiltrees.length === 0) {
    liste.innerHTML = `<div class="...">Aucune idée trouvée</div>`;
    return;
  }
  
  liste.innerHTML = "";
  ideesFiltrees.forEach(idee => liste.appendChild(renderCarteIdee(idee)));
};


export async function chargerIdees() {
  const { data, error } = await client
    .from("sunuidee")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  state.idees = data;
  mettreAJourListeIdees();
}

export function initFilters(buttons, state, mettreAJourListeIdees) {

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            const filter = button.dataset.filter;

            if (filter === "all") {

                state.activeFilters = [];

                buttons.forEach(btn => {
                    btn.classList.remove("bg-primary");
                    btn.classList.add("bg-gray-100");
                });

                button.classList.add("bg-primary");
                mettreAJourListeIdees();

                console.log(state.activeFilters);
                return;
            }

            buttons.forEach(btn => {
                if (btn.dataset.filter === "all") {
                    btn.classList.remove("bg-primary");
                    btn.classList.add("bg-gray-100");
                }
            });

            if (state.activeFilters.includes(filter)) {
                state.activeFilters = state.activeFilters.filter(f => f !== filter);
            } else {
                state.activeFilters.push(filter);
            }

            console.log(state.activeFilters);

            if (state.activeFilters.length === 0) {

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

}