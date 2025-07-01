import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { missionTitle, missionDetails, featName, featDetails } = await req.json();

    const prompt = `Generate a creative, thematic high fantasy mission name based on the following Warcrow game scenario:

Mission: ${missionTitle}
Mission Details: ${missionDetails.substring(0, 500)}...

Feat: ${featName}
Feat Details: ${featDetails.substring(0, 300)}...

Create a single, evocative mission name (2-6 words) that captures the essence of this scenario. The name should feel like it belongs in a high fantasy tabletop game with themes of war, magic, and ancient conflicts. Examples of style: "The Crimson Threshold", "Shadows of the Iron Crown", "The Cursed Vanguard", "Blood Moon Ascension".

Respond with ONLY the mission name, no quotes or additional text.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a creative fantasy game master who specializes in creating evocative, thematic names for military campaigns and battles in high fantasy settings.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 50,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedName = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ missionName: generatedName }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-mission-name function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});