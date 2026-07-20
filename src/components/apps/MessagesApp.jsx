import { useState } from 'react'
import PostCard from '../PostCard.jsx'
import AccountModal from '../AccountModal.jsx'

export default function MessagesApp({ items }) {
  const [account, setAccount] = useState(null)
  const msgs = items.filter((e) => e.app === 'messages')

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-3 mb-3 flex items-center justify-center border-b border-line bg-black/95 px-3 py-2 backdrop-blur">
        <span className="text-base font-bold">私訊</span>
        {msgs.length > 0 && <span className="absolute right-3 text-[10px] text-warn">來自不明帳號</span>}
      </div>
      {msgs.length === 0 && (
        <div className="mt-6 text-center text-sm text-mute">沒有新訊息。</div>
      )}
      <div className="space-y-4">
        {msgs.map((ev) => (
          <PostCard key={ev.id} ev={ev} onOpenAccount={setAccount} variant="dm" />
        ))}
      </div>
      {account && <AccountModal ev={account} onClose={() => setAccount(null)} />}
    </div>
  )
}
