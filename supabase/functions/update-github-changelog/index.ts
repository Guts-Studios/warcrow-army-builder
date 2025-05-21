
// Supabase Edge Function to update CHANGELOG.md in GitHub
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
    const { content, message } = await req.json();
    
    if (!content) {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    // Get GitHub credentials from environment variables
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    const repoOwner = Deno.env.get('GITHUB_REPO_OWNER');
    const repoName = Deno.env.get('GITHUB_REPO_NAME');
    
    if (!githubToken || !repoOwner || !repoName) {
      return new Response(JSON.stringify({ error: 'GitHub configuration missing' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    // First, get the current file's SHA (needed for updating)
    const currentFileResp = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/CHANGELOG.md`, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });
    
    if (!currentFileResp.ok) {
      const errorData = await currentFileResp.text();
      throw new Error(`Failed to get current file: ${currentFileResp.status} ${errorData}`);
    }
    
    const currentFile = await currentFileResp.json();
    const sha = currentFile.sha;
    
    // Encode the content to base64
    const encoder = new TextEncoder();
    const bytes = encoder.encode(content);
    const base64Content = btoa(String.fromCharCode(...bytes));
    
    // Update the file in GitHub
    const updateResp = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/CHANGELOG.md`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message || 'Update CHANGELOG.md',
        content: base64Content,
        sha: sha,
        committer: {
          name: 'WAB Admin',
          email: 'warcrowarmy@gmail.com'
        }
      })
    });
    
    if (!updateResp.ok) {
      const errorData = await updateResp.text();
      throw new Error(`Failed to update file: ${updateResp.status} ${errorData}`);
    }
    
    const result = await updateResp.json();
    
    return new Response(JSON.stringify({ success: true, commitSha: result.commit.sha }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
    
  } catch (error) {
    console.error('Error in update-github-changelog:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
