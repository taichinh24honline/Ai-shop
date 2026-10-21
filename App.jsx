const { useState } = React;

const PRODUCTS = [
  {
    id: 1,
    name: "Đầm Dạ Hội Bán Nguyệt Cao Cấp",
    category: "Đầm",
    price: 1850000,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
    description: "Đầm thiết kế tôn dáng thanh lịch, phù hợp cho các buổi tiệc tối và sự kiện sang trọng."
  },
  {
    id: 2,
    name: "Áo Blazer Phong Cách Hàn Quốc",
    category: "Áo khoác",
    price: 950000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
    description: "Phom dáng Oversized hiện đại, dễ dàng phối cùng quần jeans hoặc chân váy."
  },
  {
    id: 3,
    name: "Sơ Mi Lụa Cổ V Công Sở",
    category: "Áo",
    price: 520000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
    description: "Chất liệu lụa mềm mại, thoáng mát, mang lại vẻ thanh lịch chốn công sở."
  },
  {
    id: 4,
    name: "Chân Váy Xòe Vintage Luxury",
    category: "Váy",
    price: 680000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
    description: "Thiết kế xếp ly xòe nhẹ giúp che khuyết điểm vòng 3 hiệu quả."
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('shop');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  
  // Cấu hình AI & API Key
  const [apiKey, setApiKey] = useState('');
  const [avatarMode, setAvatarMode] = useState('custom');
  const [userAvatar, setUserAvatar] = useState(null);
  const [avatarConfig, setAvatarConfig] = useState({
    height: 165,
    weight: 52,
    skinTone: 'Sáng',
    bodyShape: 'Đồng hồ cát'
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Gọi Gemini API thực tế
  const handleRealAITryOn = async () => {
    if (!apiKey.trim()) {
      alert("Vui lòng nhập Google Gemini API Key của bạn để sử dụng AI thực tế!");
      return;
    }

    setIsProcessing(true);
    setAiAnalysis(null);

    try {
      const promptText = `Bạn là một chuyên gia Stylist thời trang cao cấp. Khách hàng có thông số vóc dáng: Chiều cao ${avatarConfig.height}cm, Cân nặng ${avatarConfig.weight}kg, Dáng người ${avatarConfig.bodyShape}, Tone da ${avatarConfig.skinTone}. Họ muốn thử trang phục: "${selectedProduct.name}" (${selectedProduct.description}). Hãy đánh giá xem sản phẩm này có phù hợp với họ không, chấm điểm từ 1 đến 100, và đưa ra lời khuyên ngắn gọn, tinh tế bằng tiếng Việt. Trả về định dạng đoạn văn ngắn gọn, chuyên nghiệp.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }]
        })
      });

      const data = await response.json();
      const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI không thể phân tích lúc này. Vui lòng thử lại.";
      
      setAiAnalysis({
        text: textResult,
        image: selectedProduct.image
      });
    } catch (error) {
      console.error(error);
      alert("Lỗi kết nối với Gemini API. Vui lòng kiểm tra lại Key.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('shop')}>
            <span className="text-2xl">✨</span>
            <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
              AI FASHION STUDIO
            </span>
          </div>

          <nav className="flex space-x-6 text-sm font-medium">
            <button 
              onClick={() => setActiveTab('shop')} 
              className={`hover:text-amber-400 transition ${activeTab === 'shop' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-300'}`}
            >
              Cửa Hàng
            </button>
            <button 
              onClick={() => setActiveTab('tryon')} 
              className={`hover:text-amber-400 transition ${activeTab === 'tryon' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-300'}`}
            >
              Phòng Thử Đồ AI 👗
            </button>
          </nav>

          <div className="flex items-center space-x-2">
            <span className="text-xl">🛒</span>
            <span className="bg-amber-500 text-slate-900 font-bold text-xs px-2 py-0.5 rounded-full">
              {cart.length}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'shop' && (
          <div>
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl p-6 md:p-10 mb-8 shadow-xl">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Thử Đồ Thông Minh Cùng AI</h1>
              <p className="text-slate-300 max-w-2xl mb-6">
                Tích hợp Google Gemini AI phân tích vóc dáng và tư vấn trang phục chuẩn xác cho riêng bạn!
              </p>
              <button 
                onClick={() => setActiveTab('tryon')}
                className="bg-amber-400 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-amber-300 transition shadow-lg"
              >
                Mở Phòng Thử Đồ AI Ngay →
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-slate-800">Bộ Sưu Tập Mới Nhất</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCTS.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition border border-slate-100 flex flex-col">
                  <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-lg mt-2 text-slate-800">{product.name}</h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-900">
                        {product.price.toLocaleString('vi-VN')} đ
                      </span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => { setSelectedProduct(product); setActiveTab('tryon'); }}
                          className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition"
                        >
                          Thử AI
                        </button>
                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-500 hover:text-slate-900 transition"
                        >
                          Mua
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tryon' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-md border border-slate-100 space-y-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span>🔑</span> Cấu Hình Gemini AI Key
              </h2>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nhập Google Gemini API Key:</label>
                <input 
                  type="password" 
                  placeholder="AIzaSy..." 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">Key của bạn chỉ dùng trực tiếp trên trình duyệt để gọi AI tư vấn.</p>
              </div>

              <hr className="border-slate-100 my-2" />

              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span>👤</span> Thông Số Vóc Dáng
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Chiều cao: {avatarConfig.height} cm</label>
                  <input 
                    type="range" min="150" max="190" value={avatarConfig.height}
                    onChange={(e) => setAvatarConfig({...avatarConfig, height: e.target.value})}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Cân nặng: {avatarConfig.weight} kg</label>
                  <input 
                    type="range" min="40" max="90" value={avatarConfig.weight}
                    onChange={(e) => setAvatarConfig({...avatarConfig, weight: e.target.value})}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Dáng người</label>
                  <select 
                    value={avatarConfig.bodyShape}
                    onChange={(e) => setAvatarConfig({...avatarConfig, bodyShape: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  >
                    <option value="Đồng hồ cát">Đồng hồ cát</option>
                    <option value="Dáng quả lê">Dáng quả lê</option>
                    <option value="Dáng quả táo">Dáng quả táo</option>
                    <option value="Mảnh khảnh">Mảnh khảnh</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Tone màu da</label>
                  <select 
                    value={avatarConfig.skinTone}
                    onChange={(e) => setAvatarConfig({...avatarConfig, skinTone: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm"
                  >
                    <option value="Sáng">Trắng sáng</option>
                    <option value="Trung bình">Trung bình / Tự nhiên</option>
                    <option value="Bánh mật">Bánh mật / Ngăm</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">Đang thử sản phẩm</span>
                <div className="flex items-center space-x-3 mt-2">
                  <img src={selectedProduct.image} className="w-14 h-14 object-cover rounded-lg" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">{selectedProduct.name}</h4>
                    <p className="text-xs font-bold text-amber-600">{selectedProduct.price.toLocaleString('vi-VN')} đ</p>
                  </div>
                </div>

                <button 
                  onClick={handleRealAITryOn}
                  disabled={isProcessing}
                  className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold py-3 rounded-xl shadow-lg hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50"
                >
                  {isProcessing ? "Gemini AI Đang Phân Tích..." : "🚀 Gửi Yêu Cầu Cho AI Stylist"}
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <span>✨</span> Phòng Xem Mẫu Thử Đồ & AI Stylist Tư Vấn
                </h3>
                <p className="text-xs text-slate-400 mb-6">Kết quả phân tích trực tiếp từ mô hình Gemini AI</p>
              </div>

              <div className="flex-1 min-h-[380px] bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center p-6 relative overflow-hidden">
                {isProcessing ? (
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-amber-400 font-bold text-sm">Gemini AI đang nhận diện thông số và đánh giá phom dáng...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="w-full flex flex-col md:flex-row items-center gap-6">
                    <img src={aiAnalysis.image} alt="Product" className="h-64 rounded-lg object-cover shadow-2xl border-2 border-amber-400/50" />
                    <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex-1">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">💬 Lời Khuyên Từ AI Stylist:</span>
                      <p className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line">{aiAnalysis.text}</p>
                      <button 
                        onClick={() => addToCart(selectedProduct)}
                        className="w-full mt-4 bg-amber-400 text-slate-900 font-bold py-2.5 rounded-lg text-xs hover:bg-amber-300 transition"
                      >
                        Thêm Vào Giỏ Hàng
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <span className="text-4xl block mb-2">👗</span>
                    <p className="text-sm">Nhập API Key và bấm "Gửi Yêu Cầu Cho AI Stylist" để nhận phân tích chi tiết</p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 block mb-3">Chọn mẫu khác để thử:</span>
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {PRODUCTS.map(p => (
                    <img 
                      key={p.id} 
                      src={p.image} 
                      onClick={() => setSelectedProduct(p)}
                      className={`w-14 h-14 object-cover rounded-lg cursor-pointer border-2 transition ${selectedProduct.id === p.id ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs border-t border-slate-800">
        <p>© 2026 AI Fashion Studio. Powered by Google Gemini API.</p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
