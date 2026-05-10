import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const MODEL = 'claude-sonnet-4-20250514'

export async function generateMatchPreview(
  homeTeam: string,
  awayTeam: string,
  stats: {
    homeForm: string[]
    awayForm: string[]
    headToHead: { home: number; draw: number; away: number }
    homeGoalsScored: number
    awayGoalsScored: number
    homeGoalsConceded: number
    awayGoalsConceded: number
  },
  injuries: { home: string[]; away: string[] }
): Promise<string> {
  const prompt = `You are an expert sports analyst providing a pre-match analysis. Write a professional 3-paragraph match preview.

Match: ${homeTeam} vs ${awayTeam}

Statistical Data:
- ${homeTeam} recent form: ${stats.homeForm.join(', ')} (W/D/L)
- ${awayTeam} recent form: ${stats.awayForm.join(', ')} (W/D/L)
- Head to head record: ${homeTeam} wins: ${stats.headToHead.home}, Draws: ${stats.headToHead.draw}, ${awayTeam} wins: ${stats.headToHead.away}
- ${homeTeam} goals scored per game: ${stats.homeGoalsScored}, conceded: ${stats.homeGoalsConceded}
- ${awayTeam} goals scored per game: ${stats.awayGoalsScored}, conceded: ${stats.awayGoalsConceded}

Injury/Availability:
- ${homeTeam} unavailable: ${injuries.home.length > 0 ? injuries.home.join(', ') : 'None reported'}
- ${awayTeam} unavailable: ${injuries.away.length > 0 ? injuries.away.join(', ') : 'None reported'}

Write exactly 3 paragraphs:
1. Tactical overview and current form analysis
2. Key battles and how injuries may affect team selections
3. Your analytical conclusion on what to expect from this fixture

Use professional sports journalism language. Do not use any gambling or betting terminology.`

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  })

  return (message.content[0] as { type: string; text: string }).text
}

export async function generateChampionNarrative(
  leagueName: string,
  season: string,
  simulationResults: Array<{ team: string; probability: number }>,
  iterations: number
): Promise<string> {
  const topTeams = simulationResults.slice(0, 5)
  const resultsText = topTeams
    .map((r, i) => `${i + 1}. ${r.team}: ${(r.probability * 100).toFixed(1)}% probability`)
    .join('\n')

  const prompt = `You are a leading sports analytics expert. Based on a ${iterations.toLocaleString()}-iteration Monte Carlo simulation of the ${leagueName} ${season}, write a 3-paragraph analytical report explaining the championship probability outcomes.

Simulation Results (Top 5):
${resultsText}

Full Rankings (all teams):
${simulationResults.map((r, i) => `${i + 1}. ${r.team}: ${(r.probability * 100).toFixed(1)}%`).join('\n')}

Write exactly 3 paragraphs:
1. Explain why ${topTeams[0]?.team} leads the simulation and what factors drive their edge
2. Discuss the realistic challengers and what scenarios could shift the title race
3. Conclude with the broader narrative of this season's title race

Use expert sports analytics language. Focus on team quality, squad depth, tactical advantages, and historical patterns. No gambling language.`

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 900,
    messages: [{ role: 'user', content: prompt }],
  })

  return (message.content[0] as { type: string; text: string }).text
}

export async function generateWhatIfAnalysis(
  leagueName: string,
  injuredPlayer: { name: string; team: string; position: string },
  originalResults: Array<{ team: string; probability: number }>,
  newResults: Array<{ team: string; probability: number }>
): Promise<string> {
  const originalTop = originalResults[0]
  const newTop = newResults[0]

  const affectedTeam = originalResults.find((r) => r.team === injuredPlayer.team)
  const affectedTeamNew = newResults.find((r) => r.team === injuredPlayer.team)

  const shift = affectedTeam && affectedTeamNew
    ? ((affectedTeamNew.probability - affectedTeam.probability) * 100).toFixed(1)
    : '0'

  const prompt = `You are a sports analytics expert conducting a "What If" scenario analysis for ${leagueName}.

Scenario: ${injuredPlayer.name} (${injuredPlayer.position}, ${injuredPlayer.team}) is ruled out for the remainder of the season.

Before injury simulation: ${originalTop?.team} leads with ${((originalTop?.probability ?? 0) * 100).toFixed(1)}% probability
After injury simulation: ${newTop?.team} leads with ${((newTop?.probability ?? 0) * 100).toFixed(1)}% probability

Impact on ${injuredPlayer.team}: ${shift}% change in championship probability

Write 2 paragraphs:
1. Analyse the immediate impact of losing ${injuredPlayer.name} on ${injuredPlayer.team}'s prospects and why this shift occurred
2. Explain which teams benefit most from this scenario and how the title race reshapes

Expert analytical tone. No gambling language.`

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  })

  return (message.content[0] as { type: string; text: string }).text
}

export async function generateLeagueNarrative(
  leagueName: string,
  season: string,
  standings: Array<{ team: string; points: number; played: number; gd: number }>,
  simulationResults: Array<{ team: string; probability: number }>
): Promise<string> {
  const topStandings = standings.slice(0, 6)
  const top4Sim = simulationResults.slice(0, 4)

  const prompt = `You are a senior sports analyst. Provide a concise 2-paragraph simulation outlook for the ${leagueName} ${season}.

Current Standings (Top 6):
${topStandings.map((s, i) => `${i + 1}. ${s.team} — ${s.points}pts, ${s.played} played, GD: ${s.gd > 0 ? '+' : ''}${s.gd}`).join('\n')}

AI Simulation: Predicted Top 4 Finishers:
${top4Sim.map((r, i) => `${i + 1}. ${r.team}: ${(r.probability * 100).toFixed(1)}%`).join('\n')}

Write 2 analytical paragraphs covering the current season trajectory and what the simulation suggests for the final standings. Professional tone, no gambling language.`

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  })

  return (message.content[0] as { type: string; text: string }).text
}
