import { supabase } from  "../config/supabaseClient.js";
export function startIssuesListener() {
  supabase
    .channel("issues_channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "issues" },
      async (payload) => {
        const issue = payload.new;
        console.log("New issue detected:", issue.id);

        if (!issue.department) {
          try {
            const response = await fetch(
              "https://npxvlwxenlxlqlyiriob.supabase.co/functions/v1/autoDepartment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: issue.id }),
              }
            );
            const result = await response.json();
            console.log("Edge function result:", result);
          } catch (err) {
            console.error("Error calling Edge Function:", err);
          }
        }
      }
    )
    .subscribe();

  console.log("Supabase issues listener started...");
}
