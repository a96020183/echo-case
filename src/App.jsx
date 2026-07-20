import { GameProvider, useGame } from './game/GameContext.jsx'
import IntroScreen from './screens/IntroScreen.jsx'
import PlayScreen from './screens/PlayScreen.jsx'
import EndingScreen from './screens/EndingScreen.jsx'
import GameOverScreen from './screens/GameOverScreen.jsx'

function Router() {
  const { state } = useGame()
  if (state.screen === 'intro') return <IntroScreen />
  if (state.screen === 'ending') return <EndingScreen />
  if (state.screen === 'gameover') return <GameOverScreen />
  return <PlayScreen />
}

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-full w-full flex items-center justify-center p-4">
        <Router />
      </div>
    </GameProvider>
  )
}
