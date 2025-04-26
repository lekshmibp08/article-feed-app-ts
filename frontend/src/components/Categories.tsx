const categories = [
    "Sports",
    "Politics",
    "Technology",
    "Space",
    "Health",
    "Entertainment",
    "Science",
    "Business",
  ];

  const Categories = () => {
    return (
      <div className="bg-gray-100 py-20 text-center">
        <h2 className="text-3xl font-bold">Featured Categories</h2>
        <p className="text-gray-500 mt-2 text-lg">Explore articles from various categories and customize your feed based on your preferences.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-5xl mx-auto px-4">
          {categories.map((category, index) => (
            <button key={index} className="px-8 py-4 border border-gray-300 rounded-lg text-lg font-semibold bg-white hover:bg-gray-200 shadow-md">
              {category}
            </button>
          ))}
        </div>
      </div>
    );
  };

export default Categories