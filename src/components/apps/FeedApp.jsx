import { useState } from 'react'
import PostCard from '../PostCard.jsx'
import AccountModal from '../AccountModal.jsx'

export default function FeedApp({ items }) {
  const [account, setAccount] = useState(null)
  const posts = items.filter((e) => e.app === 'feed')

  return (
    <div>
      {posts.length === 0 && <Empty text="這裡目前沒有新動態。" />}
      {posts.map((ev) => (
        <PostCard key={ev.id} ev={ev} onOpenAccount={setAccount} variant="thread" />
      ))}
      {account && <AccountModal ev={account} onClose={() => setAccount(null)} />}
    </div>
  )
}

function Empty({ text }) {
  return <div className="mt-4 rounded-xl border border-dashed border-line p-6 text-center text-sm text-mute">{text}</div>
}
