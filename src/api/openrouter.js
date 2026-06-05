export async function getCategorieFromAI(titre, description) {
  const models = [
    "google/gemma-3-27b-it"
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
      console.log("Réponse IA :", res);


      if (!res.ok) throw new Error("fail");

      const data = await res.json();
      return data.choices[0].message.content.trim();

    } catch (e) {
      console.log("Erreur modèle :", modelIa);
    }
  }

  throw new Error("Aucun modèle IA disponible");
}