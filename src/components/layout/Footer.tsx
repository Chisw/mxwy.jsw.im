export function Footer() {
  return (
    <>
      <div className="mt-6 mx-auto py-4 max-w-6xl border-t border-zinc-200">

        <div className="flex-between-center">
          <a
            target="_blank"
            href="https://www.netlify.com"
          >
            <img src="/assets/netlify-light.svg" className="h-12" />
          </a>
          <div className="text-sm">
            更新于 {new Date(document.lastModified).toLocaleString()}
          </div>
        </div>
      </div>
    </>
  )
}
