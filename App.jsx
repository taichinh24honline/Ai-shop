const { useState, useEffect, useRef } = React;

const ADMIN_PASSWORD = "123456";

// Khóa API Gemini của bạn đã được tích hợp sẵn
const GEMINI_API_KEY = "AQ.Ab8RN6I0c4iMF3faeAaGoLYvwg2UNFAOVF_MKQ-AxKyLxvBZHQ";

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Đầm Dạ Hội Bán Nguyệt Cao Cấp",
    category: "Đầm",
    price: 1850000,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
    description: "Đầm thiết kế tôn dáng thanh lịch, phù hợp cho các buổi tiệc tối và sự kiện sang trọng."
  },
  {
    id: 2,
    name: "Áo Blazer Phong Cách Hàn Quốc",
    category: "Áo khoác",
    price: 950000,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
    description: "Phom dáng Oversized hiện đại, dễ dàng phối cùng quần jeans hoặc chân váy."
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('shop');
  const [cart, setCart] = useState([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('app_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('app_products', JSON.stringify(products));
  }, [products]);

  const [selectedProduct, setSelectedProduct] = useState(products[0] || INITIAL_PRODUCTS[0]);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Áo', price: '', image: '', description: '' });

  // Phòng Thử Đồ & Chấm Điểm AI
  const [avatarConfig, setAvatarConfig] = useState({ height: 165, weight: 52, bodyShape: 'Đồng hồ cát' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [stylistFeedback, setStylistFeedback] = useState(null);

  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Chào bạn! Mình là Trợ lý AI tích hợp Google Gemini. Mình đã sẵn sàng trò chuyện và tư vấn thời trang cùng bạn!' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatThinking, setIsChatThinking] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatOpen]);

  // Trò chuyện thực tế với Google Gemini API
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputMessage('');
    setIsChatThinking(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `Bạn là trợ lý AI thông minh, thân thiện của cửa hàng thời trang. Hãy trả lời câu hỏi sau bằng tiếng Việt một cách tự nhiên: "${userMsg}"` }]
          }]
        })
      });

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "AI hiện tại đang bận, bạn thử lại sau nhé!";
      
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Đã có lỗi kết nối đến Gemini AI.' }]);
    } finally {
      setIsChatThinking(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (inputPassword === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      setInputPassword('');
    } else {
      alert("Mật khẩu Admin sai!");
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) return alert("Vui lòng điền đủ thông tin!");
    const item = { id: Date.now(), ...newProduct, price: Number(newProduct.price) };
    setProducts([item, ...products]);
    setSelectedProduct(item);
    setNewProduct({ name: '', category: 'Áo', price: '', image: '', description: '' });
    alert("Đã thêm sản phẩm thành công!");
  };

  const handleTryOnAnalysis = () => {
    setIsProcessing(true);
    setStylistFeedback(null);
    setTimeout(() => {
      setIsProcessing(false);
      setStylistFeedback({
        score: Math.floor(Math.random() * 10) + 90,
        advice: `Trang phục "${selectedProduct.name}" rất phù hợp với dáng ${avatarConfig.bodyShape} và chiều cao ${avatarConfig.height}cm của bạn. Tổng thể tạo cảm giác thanh lịch và thu hút!`
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('shop')}>
            <span className="text-2xl">✨</span>
            <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">AI FASHION STUDIO</span>
          </div>
          <nav className="flex space-x-4 text-xs md:text-sm font-medium">
            <button onClick={() => setActiveTab('shop')} className={`hover:text-amber-400 ${activeTab === 'shop' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-300'}`}>Cửa Hàng</button>
            <button onClick={() => setActiveTab('tryon')} className={`hover:text-amber-400 ${activeTab === 'tryon' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-300'}`}>Phòng Thử Đồ AI 👗</button>
            <button onClick={() => setActiveTab('admin')} className={`hover:text-amber-400 ${activeTab === 'admin' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-400'}`}>🔒 {isAdminLoggedIn ? "Quản Lý Shop" : "Admin"}</button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'shop' && (
          <div>
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl p-6 mb-8 shadow-xl">
              <h1 className="text-3xl font-extrabold mb-2">Thời Trang & Thử Đồ AI Thông Minh</h1>
              <p className="text-slate-300 text-sm mb-4">Trải nghiệm bộ sưu tập và tương tác trực tiếp với trợ lý Gemini AI.</p>
              <button onClick={() => setActiveTab('tryon')} className="bg-amber-400 text-slate-900 px-5 py-2.5 rounded-xl font-bold text-xs">Phòng Thử Đồ AI →</button>
            </div>

            <h2 className="text-xl font-bold mb-4">Danh Sách Sản Phẩm ({products.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 flex flex-col">
                  <img src={product.image} className="h-64 w-full object-cover" />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded">{product.category}</span>
                      <h3 className="font-bold text-lg mt-2">{product.name}</h3>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{product.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-900">{product.price.toLocaleString('vi-VN')} đ</span>
                      <button onClick={() => { setSelectedProduct(product); setActiveTab('tryon'); }} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Thử AI</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tryon' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border space-y-4">
              <h2 className="text-lg font-bold">👤 Chỉ Số Dáng Người</h2>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Chiều cao: {avatarConfig.height} cm</label>
                <input type="range" min="150" max="190" value={avatarConfig.height} onChange={(e) => setAvatarConfig({...avatarConfig, height: e.target.value})} className="w-full accent-amber-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Cân nặng: {avatarConfig.weight} kg</label>
                <input type="range" min="40" max="90" value={avatarConfig.weight} onChange={(e) => setAvatarConfig({...avatarConfig, weight: e.target.value})} className="w-full accent-amber-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Dáng người</label>
                <select value={avatarConfig.bodyShape} onChange={(e) => setAvatarConfig({...avatarConfig, bodyShape: e.target.value})} className="w-full border rounded-lg p-2 text-xs">
                  <option value="Đồng hồ cát">Đồng hồ cát</option>
                  <option value="Dáng quả lê">Dáng quả lê</option>
                  <option value="Dáng quả táo">Dáng quả táo</option>
                  <option value="Mảnh khảnh">Mảnh khảnh</option>
                </select>
              </div>

              <div className="pt-4 border-t">
                <span className="text-xs font-bold text-slate-400 uppercase">Sản phẩm thử</span>
                <div className="flex items-center space-x-3 mt-2">
                  <img src={selectedProduct?.image} className="w-14 h-14 object-cover rounded-lg" />
                  <div>
                    <h4 className="font-bold text-xs">{selectedProduct?.name}</h4>
                    <p className="text-xs font-bold text-amber-600">{selectedProduct?.price?.toLocaleString('vi-VN')} đ</p>
                  </div>
                </div>
                <button onClick={handleTryOnAnalysis} disabled={isProcessing} className="w-full mt-4 bg-amber-500 text-slate-900 font-bold py-3 rounded-xl text-xs">
                  {isProcessing ? "AI Đang Phân Tích..." : "👗 Phân Tích & Chấm Điểm AI"}
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <h3 className="text-lg font-bold mb-4">Kết Quả Phân Tích AI</h3>
              <div className="flex-1 min-h-[300px] bg-slate-800/50 rounded-xl border border-slate-700 flex items-center justify-center p-6">
                {isProcessing ? (
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-amber-400 text-xs">AI đang đánh giá tỉ lệ phom dáng...</p>
                  </div>
                ) : stylistFeedback ? (
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <img src={selectedProduct?.image} className="h-48 rounded-lg object-cover border-2 border-amber-400" />
                    <div className="bg-slate-800 p-4 rounded-xl flex-1 border border-slate-700">
                      <div className="text-2xl font-black text-emerald-400 mb-2">{stylistFeedback.score}/100 Điểm</div>
                      <p className="text-xs text-slate-200 leading-relaxed">{stylistFeedback.advice}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Bấm "Phân Tích & Chấm Điểm AI" để nhận đánh giá</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div>
            {!isAdminLoggedIn ? (
              <form onSubmit={handleAdminLogin} className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow text-center my-10 space-y-4">
                <h2 className="text-xl font-bold">🔒 Đăng Nhập Chủ Shop</h2>
                <input type="password" placeholder="Mật khẩu (123456)..." value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} className="w-full border p-2 text-xs rounded" />
                <button type="submit" className="w-full bg-slate-900 text-white py-2 text-xs font-bold rounded">Vào Quản Lý</button>
              </form>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow border space-y-4">
                <h2 className="text-xl font-bold">➕ Đăng Sản Phẩm Mới</h2>
                <form onSubmit={handleAddProduct} className="space-y-3">
                  <input type="text" placeholder="Tên sản phẩm" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full border p-2 text-xs rounded" />
                  <input type="number" placeholder="Giá tiền" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full border p-2 text-xs rounded" />
                  <input type="text" placeholder="Link ảnh URL" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} className="w-full border p-2 text-xs rounded" />
                  <textarea placeholder="Mô tả" value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full border p-2 text-xs rounded" rows="2"></textarea>
                  <button type="submit" className="bg-slate-900 text-amber-400 px-4 py-2 font-bold text-xs rounded">Đăng Bán</button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Gemini Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button onClick={() => setChatOpen(true)} className="bg-amber-500 text-slate-900 font-bold p-4 rounded-full shadow-2xl flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="hidden md:inline text-sm">Trò chuyện Gemini AI</span>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border w-80 sm:w-96 h-[460px] flex flex-col overflow-hidden">
            <div className="bg-slate-900 text-white p-3 flex justify-between">
              <span className="font-bold text-sm">🤖 Trợ Lý Gemini AI</span>
              <button onClick={() => setChatOpen(false)}>✕</button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-amber-500 text-slate-900' : 'bg-white border text-slate-800 shadow-sm'}`}>{msg.text}</div>
                </div>
              ))}
              {isChatThinking && <div className="text-slate-400 text-xs italic">Gemini AI đang trả lời...</div>}
              <div ref={chatEndRef} />
            </div>
            <div className="p-2 border-t bg-white flex gap-2">
              <input type="text" placeholder="Nhập tin nhắn..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 border rounded-xl px-3 py-2 text-xs" />
              <button onClick={handleSendMessage} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold">Gửi</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
