export async function improveFileWithLlm(config, logger, prompt) {
  const endpoint = `${config.openAiBaseUrl}/chat/completions`;
  const body = {
    model: config.openAiModel,
    temperature: 0.2,
    messages: [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user },
    ],
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openAiApiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const failureText = await response.text();
    throw new Error(
      `OpenAI API request failed (${response.status}): ${failureText}`,
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI API returned empty completion");
  }

  logger.info("LLM token usage", {
    prompt_tokens: data?.usage?.prompt_tokens ?? null,
    completion_tokens: data?.usage?.completion_tokens ?? null,
    total_tokens: data?.usage?.total_tokens ?? null,
  });

  return content;
}
