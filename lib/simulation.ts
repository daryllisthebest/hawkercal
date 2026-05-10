import { createServerSupabase, type ChampionProbability, type Player } from './supabase'
import { generateChampionNarrative, generateWhatIfAnalysis } from './claude'

export type SimulationWeights = {
  recentForm: number      // 0.40
  headToHead: number      // 0.20
  homeAdvantage: number   // 0.15
  squadFitness: number    // 0.25
}

const DEFAULT_WEIGHTS: SimulationWeights = {
  recentForm: 0.40,
  headToHead: 0.20,
  homeAdvantage: 0.15,
  squadFitness: 0.25,
}

export type TeamStrength = {
  teamId: string
  team: string
  formScore: number    // 0–1
  h2hScore: number     // 0–1
  homeScore: number    // 0–1 (1 = strong home form)
  fitnessScore: number // 0–1 (1 = fully fit)
}

export type SimulationResult = {
  team: string
  teamId: string
  probability: number
  wins: number
}

function weightedStrength(ts: TeamStrength, weights: SimulationWeights = DEFAULT_WEIGHTS): number {
  return (
    ts.formScore * weights.recentForm +
    ts.h2hScore * weights.headToHead +
    ts.homeScore * weights.homeAdvantage +
    ts.fitnessScore * weights.squadFitness
  )
}

function pickWinner(teams: TeamStrength[], weights: SimulationWeights): string {
  const strengths = teams.map((t) => weightedStrength(t, weights))
  const total = strengths.reduce((a, b) => a + b, 0)
  const roll = Math.random() * total
  let cumulative = 0
  for (let i = 0; i < teams.length; i++) {
    cumulative += strengths[i]
    if (roll <= cumulative) return teams[i].teamId
  }
  return teams[teams.length - 1].teamId
}

export async function buildTeamStrengths(
  leagueId: string,
  injuredPlayerIds: string[] = []
): Promise<TeamStrength[]> {
  const db = createServerSupabase()

  const { data: teams } = await db
    .from('teams')
    .select('id, name')
    .eq('league_id', leagueId)

  if (!teams || teams.length === 0) return []

  const { data: players } = await db
    .from('players')
    .select('id, team_id, status, injury_detail')
    .in('team_id', teams.map((t) => t.id))

  const { data: fixtures } = await db
    .from('fixtures')
    .select('home_team_id, away_team_id, home_score, away_score, status')
    .eq('league_id', leagueId)
    .eq('status', 'FT')
    .order('kickoff_time', { ascending: false })
    .limit(100)

  return teams.map((team) => {
    // Recent form: last 5 results
    const teamFixtures = (fixtures ?? []).filter(
      (f) => f.home_team_id === team.id || f.away_team_id === team.id
    ).slice(0, 5)

    let formScore = 0.5
    if (teamFixtures.length > 0) {
      let points = 0
      for (const f of teamFixtures) {
        const isHome = f.home_team_id === team.id
        const gs = isHome ? f.home_score : f.away_score
        const gc = isHome ? f.away_score : f.home_score
        if (gs > gc) points += 3
        else if (gs === gc) points += 1
      }
      formScore = points / (teamFixtures.length * 3)
    }

    // H2H: simplified — use overall record in completed fixtures
    const h2hScore = 0.5 // baseline without specific matchup data

    // Home advantage: ratio of home wins
    const homeGames = (fixtures ?? []).filter((f) => f.home_team_id === team.id)
    let homeScore = 0.55
    if (homeGames.length > 0) {
      const homeWins = homeGames.filter((f) => (f.home_score ?? 0) > (f.away_score ?? 0)).length
      homeScore = homeWins / homeGames.length
    }

    // Squad fitness: penalise for injured/suspended key players
    const teamPlayers = (players ?? []).filter((p) => p.team_id === team.id)
    const unavailable = teamPlayers.filter(
      (p) => p.status !== 'available' || injuredPlayerIds.includes(p.id)
    )
    const fitnessScore = teamPlayers.length > 0
      ? Math.max(0, 1 - unavailable.length / Math.max(teamPlayers.length, 1) * 1.5)
      : 0.75

    return {
      teamId: team.id,
      team: team.name,
      formScore: Math.min(1, Math.max(0, formScore)),
      h2hScore,
      homeScore: Math.min(1, Math.max(0, homeScore)),
      fitnessScore: Math.min(1, Math.max(0, fitnessScore)),
    }
  })
}

export async function runSimulation(
  leagueId: string,
  iterations = 1000,
  injuredPlayerIds: string[] = [],
  weights: SimulationWeights = DEFAULT_WEIGHTS
): Promise<SimulationResult[]> {
  const teamStrengths = await buildTeamStrengths(leagueId, injuredPlayerIds)

  if (teamStrengths.length === 0) {
    // Return demo data when no teams seeded yet
    return generateDemoResults()
  }

  const wins: Record<string, number> = {}
  for (const ts of teamStrengths) wins[ts.teamId] = 0

  for (let i = 0; i < iterations; i++) {
    const winner = pickWinner(teamStrengths, weights)
    wins[winner] = (wins[winner] ?? 0) + 1
  }

  return teamStrengths
    .map((ts) => ({
      teamId: ts.teamId,
      team: ts.team,
      wins: wins[ts.teamId] ?? 0,
      probability: (wins[ts.teamId] ?? 0) / iterations,
    }))
    .sort((a, b) => b.probability - a.probability)
}

function generateDemoResults(): SimulationResult[] {
  const demoTeams = [
    { team: 'Brazil', probability: 0.182 },
    { team: 'France', probability: 0.168 },
    { team: 'England', probability: 0.147 },
    { team: 'Spain', probability: 0.131 },
    { team: 'Germany', probability: 0.112 },
    { team: 'Argentina', probability: 0.098 },
    { team: 'Portugal', probability: 0.076 },
    { team: 'Netherlands', probability: 0.053 },
    { team: 'Belgium', probability: 0.033 },
  ]
  return demoTeams.map((t) => ({ ...t, teamId: t.team.toLowerCase(), wins: Math.round(t.probability * 1000) }))
}

export async function saveSimulation(
  leagueId: string,
  type: 'champion' | 'match' | 'league',
  results: SimulationResult[],
  narrative: string,
  iterations: number
): Promise<string> {
  const db = createServerSupabase()

  const { data: sim } = await db
    .from('simulations')
    .insert({
      league_id: leagueId,
      type,
      result_json: results as unknown as Record<string, unknown>[],
      narrative,
    })
    .select('id')
    .single()

  if (sim) {
    await db.from('simulation_runs').insert({
      simulation_id: sim.id,
      iterations,
      champion_probabilities_json: results.map((r) => ({
        team: r.team,
        team_id: r.teamId,
        probability: r.probability,
      })) as unknown as Record<string, unknown>[],
    })
    return sim.id
  }

  return ''
}

export async function runChampionSimulation(
  leagueId: string,
  leagueName: string,
  season: string,
  iterations = 1000,
  injuredPlayerIds: string[] = []
): Promise<{ results: SimulationResult[]; narrative: string; simulationId: string }> {
  const results = await runSimulation(leagueId, iterations, injuredPlayerIds)

  const narrative = await generateChampionNarrative(leagueName, season, results, iterations)

  const simulationId = await saveSimulation(leagueId, 'champion', results, narrative, iterations)

  return { results, narrative, simulationId }
}

export function predictMatchOutcome(
  homeStrength: number,
  awayStrength: number,
  homeAdvantage = 0.05
): { homeWin: number; draw: number; awayWin: number; predictedHomeGoals: number; predictedAwayGoals: number } {
  const adjustedHome = homeStrength + homeAdvantage
  const total = adjustedHome + awayStrength
  const homeWin = adjustedHome / total * 0.65
  const awayWin = awayStrength / total * 0.55
  const draw = 1 - homeWin - awayWin

  const predictedHomeGoals = Math.max(0, Math.round(adjustedHome * 2.5))
  const predictedAwayGoals = Math.max(0, Math.round(awayStrength * 2.0))

  return {
    homeWin: Math.max(0, Math.min(1, homeWin)),
    draw: Math.max(0, Math.min(1, draw)),
    awayWin: Math.max(0, Math.min(1, awayWin)),
    predictedHomeGoals,
    predictedAwayGoals,
  }
}
