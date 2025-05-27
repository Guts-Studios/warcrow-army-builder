
// Supabase Edge Function to sync generated files to GitHub
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.24.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Verify the user is an admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // Check if the user is an admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('wab_admin')
      .eq('id', user.id)
      .single();
    
    if (profileError || !profile || !profile.wab_admin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Parse the request body
    const { files, factionId } = await req.json();
    
    if (!files || !factionId) {
      return new Response(JSON.stringify({ error: 'Files and factionId are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    // Get GitHub credentials from environment variables
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    const repoOwner = 'Guts-Studios';
    const repoName = 'warcrow-army-builder';
    const branch = 'main';
    
    if (!githubToken) {
      return new Response(JSON.stringify({ error: 'GitHub token not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    const updatedFiles: string[] = [];
    const errors: string[] = [];
    
    // File path mappings
    const filePathMap = {
      troops: `src/data/factions/${factionId}/troops.ts`,
      characters: `src/data/factions/${factionId}/characters.ts`,
      highCommand: `src/data/factions/${factionId}/highCommand.ts`,
      index: `src/data/factions/${factionId}/index.ts`
    };
    
    // Update each file
    for (const [fileKey, content] of Object.entries(files)) {
      const filePath = filePathMap[fileKey as keyof typeof filePathMap];
      if (!filePath) continue;
      
      try {
        console.log(`Updating file: ${filePath}`);
        
        // Get the current file's SHA (needed for updating)
        const currentFileResp = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          }
        });
        
        let sha: string | undefined;
        if (currentFileResp.ok) {
          const currentFile = await currentFileResp.json();
          sha = currentFile.sha;
        } else if (currentFileResp.status !== 404) {
          throw new Error(`Failed to get current file: ${currentFileResp.status}`);
        }
        
        // Encode the content to base64
        const encoder = new TextEncoder();
        const bytes = encoder.encode(content as string);
        const base64Content = btoa(String.fromCharCode(...bytes));
        
        // Update or create the file in GitHub
        const updateData: any = {
          message: `Update ${fileKey} for ${factionId} via CSV sync [skip ci]`,
          content: base64Content,
          branch: branch,
          committer: {
            name: 'WAB Admin',
            email: 'warcrowarmy@gmail.com'
          }
        };
        
        if (sha) {
          updateData.sha = sha;
        }
        
        const updateResp = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });
        
        if (!updateResp.ok) {
          const errorData = await updateResp.text();
          throw new Error(`Failed to update ${filePath}: ${updateResp.status} ${errorData}`);
        }
        
        updatedFiles.push(filePath);
        console.log(`Successfully updated: ${filePath}`);
        
      } catch (error) {
        console.error(`Error updating ${filePath}:`, error);
        errors.push(`${filePath}: ${error.message}`);
      }
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      updatedFiles,
      errors,
      message: `Updated ${updatedFiles.length} files in GitHub${errors.length > 0 ? ` with ${errors.length} errors` : ''}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error) {
    console.error('Error in sync-files-to-github:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
