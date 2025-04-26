import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"

function HomePage() {
  const categories = ["Sports", "Politics", "Technology", "Space", "Health", "Entertainment", "Science", "Business"]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-blue-600 text-xl">ArticleFeed</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Discover Articles Based on Your Interests
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Join our platform to read, create, and share articles on topics that matter to you.
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/signup">
                  <Button size="lg">Get Started →</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured Categories</h2>
                <p className="mx-auto max-w-[700px] text-gray-500">
                  Explore articles from various categories and customize your feed based on your preferences.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {categories.map((category) => (
                  <Card key={category} className="overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-xl font-bold">{category}</h3>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 text-center md:flex-row md:gap-6 px-4">
          <p className="text-sm text-gray-500">© 2025 ArticleFeed. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage

