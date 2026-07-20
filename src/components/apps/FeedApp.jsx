import { useState } from 'react'
import PostCard from '../PostCard.jsx'
import AccountModal from '../AccountModal.jsx'

export default function FeedApp({ items }) {
  const [account, setAccount] = useState(null)
  const posts = items.filter((e) => e.app === 'feed')

  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-10 -mx-3 mb-1 border-b border-line bg-panel/95 px-3 py-2 backdrop-blur">
        <span className="font-bold">🌊 動態</span>
        <span className="ml-2 text-xs text-danger">● 事件延燒中</span>
      </div>
      {posts.length === 0 && <Empty text="這裡目前沒有新動態。" />}
      {posts.map((ev) => (
        <PostCard key={ev.id} ev={ev} onOpenAccount={setAccount} />
      ))}
      {account && <AccountModal ev={account} onClose={() => setAccount(null)} />}
    </div>
  )
}

function Empty({ text }) {
  return <div className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-mute">{text}</div>
}
