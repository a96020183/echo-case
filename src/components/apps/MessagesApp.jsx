import { useState } from 'react'
import PostCard from '../PostCard.jsx'
import AccountModal from '../AccountModal.jsx'

export default function MessagesApp({ items }) {
  const [account, setAccount] = useState(null)
  const msgs = items.filter((e) => e.app === 'messages')

  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-10 -mx-3 mb-1 border-b border-line bg-panel/95 px-3 py-2 backdrop-blur">
        <span className="font-bold">✉️ 私訊</span>
        {msgs.length > 0 && <span className="ml-2 text-xs text-warn">來自不明帳號</span>}
      </div>
      {msgs.length === 0 && (
        <div className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-mute">
          目前沒有新私訊。
        </div>
      )}
      {msgs.map((ev) => (
        <PostCard key={ev.id} ev={ev} onOpenAccount={setAccount} variant="dm" />
      ))}
      {account && <AccountModal ev={account} onClose={() => setAccount(null)} />}
    </div>
  )
}
