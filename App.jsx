const { useState, useEffect, useRef } = React;

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
  
  // Trạng thái thử đồ
  const [avatarConfig, setAvatarConfig] = useState({ height: 165, weight: 52, skinTone: 'Trắng sáng', bodyShape: 'Đồng hồ cát' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [stylistFeedback, setStylistFeedback] = useState(null);

  // Trạng thái AI Chatbot (Trò chuyện tự nhiên)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Chào bạn! Mình là AI Trợ lý thông minh. Ngoài tư vấn thời trang, mình có thể trò chuyện với bạn về mọi chủ đề trong cuộc sống: công nghệ, lịch sử, giải trí hay tâm sự bất cứ điều gì bạn thích! Bạn đang quan tâm đến chủ đề gì hôm nay?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatThinking, setIsChatThinking] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatOpen]);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Phân tích phối đồ bằng AI
  const handleTryOnAnalysis = () => {
    setIsProcessing(true);
    setStylistFeedback(null);

    setTimeout(() => {
      setIsProcessing(false);
      setStylistFeedback({
        score: Math.floor(Math.random() * 10) + 90,
        advice: `Bộ trang phục "${selectedProduct.name}" rất tôn dáng ${avatarConfig.bodyShape} của bạn. Chiều cao ${avatarConfig.height}cm cùng nước da ${avatarConfig.skinTone} khi kết hợp với gam màu này sẽ tạo nên tổng thể vừa thanh lịch vừa thu hút. Khuyên bạn nên phối thêm một đôi giày cao gót tông nude để kéo dài đôi chân!`
      });
    }, 1200);
  };

  // Trò chuyện tự nhiên với Chatbot AI
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputMessage('');
    setIsChatThinking(true);

    // Xử lý phản hồi thông minh mô phỏng AI như người thật
    setTimeout(() => {
      let aiResponse = "";
      const lower = userMsg.toLowerCase();

      if (lower.includes("chào") || lower.includes("hi") || lower.includes("hello")) {
        aiResponse = "Rất vui được nói chuyện với bạn! Bạn có một ngày như thế nào?";
      } else if (lower.includes("tên") || lower.includes("bạn là ai")) {
        aiResponse = "Mình là AI Trợ lý được tích hợp trên trang web. Mình có thể hiểu thông tin, giải đáp kiến thức, trò chuyện tự nhiên và hỗ trợ bạn mua sắm mượt mà nhất!";
      } else if (lower.includes("game") || lower.includes("lập trình") || lower.includes("code") || lower.includes("công nghệ")) {
        aiResponse = "Công nghệ và lập trình là một chủ đề cực kỳ thú vị! Bạn đang tìm hiểu về mảng nào? Web, ứng dụng di động hay phát triển game?";
      } else if (lower.includes("lịch sử") || lower.includes("văn hóa")) {
        aiResponse = "Lịch sử luôn chứa đựng những câu chuyện tuyệt vời về các triều đại và văn hóa. Bạn thích tìm hiểu về lịch sử Việt Nam hay các triều đại thế giới?";
      } else {
        aiResponse = `Cảm ơn bạn đã chia sẻ về "${userMsg}". Đó là một chủ đề rất hay! Mình luôn sẵn sàng lắng nghe và trao đổi tiếp cùng bạn đấy.`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsChatThinking(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
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

          <div className="flex items-center space-x-3">
            <div className="relative cursor-pointer">
              <span className="text-xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-900 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'shop' && (
          <div>
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl p-6 md:p-10 mb-8 shadow-xl">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Mua Sắm & Trải Nghiệm AI</h1>
              <p className="text-slate-300 max-w-2xl mb-6">
                Tự do thử đồ với bộ công cụ tùy chỉnh kích thước cơ thể và trò chuyện cùng AI thông minh tự nhiên như người thật!
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setActiveTab('tryon')}
                  className="bg-amber-400 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-amber-300 transition shadow-lg"
                >
                  Thử Đồ AI Ngay →
                </button>
                <button 
                  onClick={() => setChatOpen(true)}
                  className="bg-white/10 backdrop-blur text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition border border-white/20"
                >
                  💬 Chat Cùng AI Thông Minh
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 text-slate-800">Sản Phẩm Nổi Bật</h2>
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

        {/* Tab Phòng Thử Đồ */}
        {activeTab === 'tryon' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-slate-100 space-y-4">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span>👤</span> Tùy Chỉnh Kích Thước Nhân Vật
              </h2>

              <div className="space-y-4">
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
                    <option value="Trắng sáng">Trắng sáng</option>
                    <option value="Trung bình">Trung bình / Tự nhiên</option>
                    <option value="Bánh mật">Bánh mật / Ngăm</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">Sản phẩm thử</span>
                <div className="flex items-center space-x-3 mt-2">
                  <img src={selectedProduct.image} className="w-14 h-14 object-cover rounded-lg" />
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">{selectedProduct.name}</h4>
                    <p className="text-xs font-bold text-amber-600">{selectedProduct.price.toLocaleString('vi-VN')} đ</p>
                  </div>
                </div>

                <button 
                  onClick={handleTryOnAnalysis}
                  disabled={isProcessing}
                  className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold py-3 rounded-xl shadow-lg hover:from-amber-400 transition"
                >
                  {isProcessing ? "AI Đang Phân Tích Dáng Người..." : "👗 Thử Đồ & Nhận Đánh Giá AI"}
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <span>✨</span> Mô Phỏng Trang Phục & Lời Khuyên Thời Trang
                </h3>
              </div>

              <div className="flex-1 min-h-[380px] bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center p-6 relative">
                {isProcessing ? (
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-amber-400 text-sm font-bold">AI đang tính toán tỉ lệ phom dáng...</p>
                  </div>
                ) : stylistFeedback ? (
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <img src={selectedProduct.image} alt="Result" className="h-64 rounded-lg object-cover border-2 border-amber-400/50 shadow-2xl" />
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-400 uppercase">Điểm Tôn Dáng</span>
                        <span className="text-2xl font-black text-emerald-400">{stylistFeedback.score}/100</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed mb-4">{stylistFeedback.advice}</p>
                      <button 
                        onClick={() => addToCart(selectedProduct)}
                        className="w-full bg-amber-400 text-slate-900 font-bold py-2 rounded-lg text-xs hover:bg-amber-300"
                      >
                        Thêm Vào Giỏ Hàng
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500">
                    <span className="text-4xl block mb-2">🛍️</span>
                    <p className="text-sm">Bấm nút "Thử Đồ & Nhận Đánh Giá AI" để xem phản hồi</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cửa sổ Chatbot AI Trò Chuyện Tự Nhiên (Floating Chatbox) */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button 
            onClick={() => setChatOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold p-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition"
          >
            <span className="text-2xl">🤖</span>
            <span className="hidden md:inline text-sm">Trò chuyện cùng AI</span>
          </button>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 h-[480px] flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="bg-slate-900 text-white p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">🤖</span>
                <div>
                  <h4 className="font-bold text-sm">Trợ Lý AI Thông Minh</h4>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Sẵn sàng trò chuyện 24/7
                  </span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white text-lg font-bold px-2">✕</button>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-amber-500 text-slate-900 rounded-br-none font-medium' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatThinking && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-400 p-3 rounded-2xl rounded-bl-none text-xs flex items-center space-x-1">
                    <span>AI đang trả lời</span>
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-2 border-t border-slate-200 bg-white flex gap-2">
              <input 
                type="text"
                placeholder="Nói chuyện hoặc hỏi AI bất cứ điều gì..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
              <button 
                onClick={handleSendMessage}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-500 hover:text-slate-900 transition"
              >
                Gửi
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs border-t border-slate-800">
        © 2026 AI Fashion Studio. Tích hợp AI Trợ Lý Thông Minh Toàn Diện.
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
