export default {
	async fetch(request, env) {
		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': '*',
		};

		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 200, headers: corsHeaders });
		}

		try {
			const { base64, mimeType, type } = await request.json();

			if (!base64) {
				return new Response(JSON.stringify({ error: 'No image' }), {
					status: 400,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			}

			const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
					'Content-Type': 'application/json',
					'HTTP-Referer': 'https://meter-ai-worker.mrrvisal617.workers.dev',
					'X-Title': 'Meter Reader',
				},
				body: JSON.stringify({
					model: 'google/gemini-2.0-flash-lite-001',
					messages: [
						{
							role: 'user',
							content: [
								{
									type: 'text',
									text: `Read the ${type} meter display. Return ONLY the number, nothing else.`,
								},
								{
									type: 'image_url',
									image_url: { url: `data:${mimeType};base64,${base64}` },
								},
							],
						},
					],
					max_tokens: 50,
				}),
			});

			if (!aiRes.ok) {
				const errText = await aiRes.text();
				return new Response(JSON.stringify({ error: `OpenRouter error: ${errText}` }), {
					status: 502,
					headers: { 'Content-Type': 'application/json', ...corsHeaders },
				});
			}

			const aiData = await aiRes.json();
			const text = aiData?.choices?.[0]?.message?.content?.trim() || '';
			const match = text.match(/[\d.]+/);
			const number = match ? Number(match[0]) : null;

			return new Response(JSON.stringify({ number, raw: text }), {
				status: 200,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		} catch (err) {
			return new Response(JSON.stringify({ error: err.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json', ...corsHeaders },
			});
		}
	},
};
