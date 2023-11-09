// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import {
  env,
  pipeline,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.7.0";

env.useBrowserCache = false;
env.allowLocalModels = false;

const generateEmbedding = await pipeline(
  "feature-extraction",
  "Supabase/gte-small",
);

Deno.serve(async (req) => {
  const { input } = await req.json();

  const output = await generateEmbedding(input, {
    pooling: "mean",
    normalize: true,
  });

  console.log(output);

  const embedding = Array.from(output.data);

  console.log(embedding);

  return new Response(
    JSON.stringify(embedding),
    { headers: { "Content-Type": "application/json" } },
  );
});

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-embedding' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"input":"Supabase is the best"}'
