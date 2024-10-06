function mockContent() {
  const words = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"];

  for (let i = words.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j] ?? "", words[i] ?? ""];
  }

  const wordsText = words.join(" ");
  return `${wordsText.slice(0, 1).toUpperCase()}${wordsText.slice(1)}.`;
}

function mockPriority() {
  const rand = Math.random();

  if (rand < 0.33) {
    return "high";
  } else if (rand < 0.66) {
    return "medium";
  }

  return "low";
}

async function fetchApi(): Promise<unknown> {
  console.info("sw:", "fetchApi");

  return Promise.resolve({
    messages: [
      {
        id: crypto.randomUUID(),
        content: mockContent(),
        priority: mockPriority(),
        timestamp: new Date().toISOString(),
        read: false,
      },
    ],
  });
}

export default fetchApi;
