const API_BASE = '/api/riot';

export async function checkLiveGame(gameName, tagLine, region = 'americas') {
  try {
    const response = await fetch(
      `${API_BASE}/live-game?name=${encodeURIComponent(gameName)}&tag=${encodeURIComponent(tagLine)}&region=${region}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to check live game');
    }

    return data;
  } catch (error) {
    console.error('Live game check error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}