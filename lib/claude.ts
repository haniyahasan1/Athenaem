import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateHook(title: string, abstract: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 120,
    messages: [
      {
        role: 'user',
        content: `You write hooks for a weekly article digest called Athenaem. Your job is to make someone genuinely curious to read an article in 1-2 sentences, max.

Use this exact structure: [Intriguing fact or situation] + [Implication or consequence] + [The thing withheld]. The third part is what you don't say — leave the reader hanging on the most interesting thing. Sound like a smart friend texting you, not a newsletter. Never start with "Discover" or "Explore". Never summarize — hook.

If the abstract is thin or missing, use the title alone to craft the hook. You must always produce a hook — never say you can't or don't have enough information.

Article: ${title}
Abstract: ${abstract}

Write only the hook. Nothing else.`,
      },
    ],
  });

  return message.content[0].type === 'text' ? message.content[0].text.trim() : '';
}
