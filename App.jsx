const { useState } = React;

const PRODUCTS = [
  {
    id: 1,
    name: "Đầm Dạ Hội Bán Nguyệt Cao Cấp",
    category: "Đầm",
    price: 1850000,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80",
    garmentImage: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Áo Blazer Phong Cách Hàn Quốc",
    category: "Áo khoác",
    price: 950000,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
    garmentImage: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Sơ Mi Lụa Cổ V Công Sở",
    category: "Áo",
    price: 520000,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
    garmentImage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('shop');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  
  // API Keys
  const [fashnKey, setFashnKey] = useState('');
  const [userPhoto, setUserPhoto] = useState(null); // URL ảnh người dùng tải lên

  const [isProcessing, setIsProcessing] = useState(false);
  const [tryOnResultImage, setTryOnResultImage] = useState(null);
  const [statusText, setStatusText] = useState('');

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  // Tải ảnh người dùng
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Gọi Fashn.ai API để thực hiện Virtual Try-On
  const handleVirtualTryOn = async () => {
    if (!fashnKey.trim()) {
      alert("Vui lòng nhập Fashn.ai API Key để chạy tính năng ghép đồ!");
      return;
    }
    if (!userPhoto) {
      alert("Vui lòng tải lên ảnh toàn thân của bạn trước!");
      return;
    }

    setIsProcessing(true);
    setTryOnResultImage(null);
    setStatusText("Đang gửi yêu cầu đến máy chủ AI Try-On...");

    try {
      // Bước 1: Gửi request tạo tác vụ ghép đồ
      const response = await fetch("https://api.fashn.ai/v1/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${fashnKey}`
        },
        body: JSON.stringify({
          model_image: userPhoto,
          garment_image: selectedProduct.garmentImage,
          category: "tops" // Hoặc tự động nhận diện theo sản phẩm
        })
      });

      const data = await response.json();
      if (!data.id) {
        throw new Error(data.message || "Không thể khởi tạo tác vụ AI.");
      }

      const predictionId = data.id;
      setStatusText("AI đang tiến hành ghép trang phục lên ảnh (Quá trình này mất khoảng 10-20 giây)...");

      // Bước 2: Polling kiểm tra trạng thái hoàn thành từ Fashn API
      let completed = false;
      let finalImageUrl = null;

      while (!completed) {
        await new Promise(r => setTimeout(r, 3000)); // Chờ 3 giây mỗi lần check
        
        const statusRes = await fetch(`https://api.fashn.ai/v1/status/${predictionId}`, {
          headers: { "Authorization": `Bearer ${fashnKey}` }
        });
        const statusData = await statusRes.json();

        if (statusData.status === "completed") {
          completed = true;
          finalImageUrl = statusData.output?.[0];
        } else if (statusData.status === "failed") {
          throw new Error("Quá trình xử lý ảnh AI thất bại. Vui lòng thử lại với ảnh rõ nét hơn.");
        }
      }

      setTryOnResultImage(finalImageUrl);
    } catch (error) {
      console.error(error);
      alert(`Lỗi: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setStatusText('');
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
            <button onClick={() => setActiveTab('shop')} className={`hover:text-amber-400 ${activeTab === 'shop' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-300'}`}>Cửa Hàng</button>
            <button onClick={() => setActiveTab('tryon')} className={`hover:text-amber-400 ${activeTab === 'tryon' ? 'text-amber-400 border-b-2 border-amber-400 pb-1' : 'text-slate-300'}`}>Phòng Thử Đồ AI 👗</button>
          </nav>
          <div className="flex items-center space-x-2">
            <span>🛒</span>
            <span className="bg-amber-500 text-slate-900 font-bold text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'shop' && (
          <div>
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-2xl p-6 md:p-10 mb-8 shadow-xl">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Thử Đồ Ảo AI Thực Tế</h1>
              <p className="text-slate-300 max-w-2xl mb-6">Tải ảnh toàn thân của bạn lên và để AI tự động mặc trang phục lên người bạn với độ chân thực cao.</p>
              <button onClick={() => setActiveTab('tryon')} className="bg-amber-400 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-amber-300 transition shadow-lg">Vào Phòng Thử Đồ Ngay →</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCTS.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 flex flex-col">
                  <img src={product.image} alt={product.name} className="h-64 w-full object-cover" />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">{product.category}</span>
                      <h3 className="font-bold text-lg mt-2 text-slate-800">{product.name}</h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-lg font-bold text-indigo-900">{product.price.toLocaleString('vi-VN')} đ</span>
                      <button onClick={() => { setSelectedProduct(product); setActiveTab('tryon'); }} className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-500 hover:text-slate-900 transition">Thử Đồ AI</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tryon' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-md border border-slate-100 space-y-4">
              <h2 className="text-lg font-bold text-slate-800">1. Nhập Fashn.ai API Key</h2>
              <input 
                type="password" 
                placeholder="Nhập khóa API Try-On..." 
                value={fashnKey} 
                onChange={(e) => setFashnKey(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs"
              />

              <h2 className="text-lg font-bold text-slate-800 pt-2">2. Tải Ảnh Toàn Thân Của Bạn</h2>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                {userPhoto ? (
                  <div>
                    <img src={userPhoto} alt="User" className="h-40 mx-auto object-cover rounded-lg mb-2" />
                    <button onClick={() => setUserPhoto(null)} className="text-xs text-red-500 underline">Đổi ảnh khác</button>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Chọn ảnh chụp đứng thẳng, rõ người</p>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload-model" />
                    <label htmlFor="upload-model" className="cursor-pointer bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold inline-block">Tải ảnh lên</label>
                  </div>
                )}
              </div>

              <h2 className="text-lg font-bold text-slate-800 pt-2">3. Chọn Trang Phục</h2>
              <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-xl">
                <img src={selectedProduct.image} className="w-14 h-14 object-cover rounded-lg" />
                <div>
                  <h4 className="font-bold text-xs text-slate-800">{selectedProduct.name}</h4>
                  <p className="text-xs font-bold text-amber-600">{selectedProduct.price.toLocaleString('vi-VN')} đ</p>
                </div>
              </div>

              <button 
                onClick={handleVirtualTryOn}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-bold py-3 rounded-xl shadow-lg hover:from-amber-400 transition disabled:opacity-50"
              >
                {isProcessing ? "AI Đang Xử Lý Ghép Đồ..." : "✨ Bắt Đầu Ghép Đồ Ngay"}
              </button>
            </div>

            <div className="lg:col-span-7 bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between items-center text-center">
              <h3 className="text-lg font-bold mb-4">Kết Quả Thử Đồ Trực Quan</h3>
              <div className="flex-1 w-full min-h-[400px] bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col items-center justify-center p-4">
                {isProcessing ? (
                  <div>
                    <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-amber-400 text-xs font-bold">{statusText}</p>
                  </div>
                ) : tryOnResultImage ? (
                  <div className="w-full h-full flex flex-col items-center">
                    <img src={tryOnResultImage} alt="Try On Result" className="max-h-[450px] rounded-lg shadow-2xl border border-amber-400/50 object-contain mb-4" />
                    <button onClick={() => addToCart(selectedProduct)} className="bg-amber-400 text-slate-900 font-bold px-6 py-2 rounded-lg text-xs hover:bg-amber-300">Thêm Vào Giỏ Hàng</button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Tải ảnh của bạn lên, chọn đồ và bấm bắt đầu để xem kết quả ghép thực tế tại đây.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-slate-900 text-slate-400 text-center py-6 text-xs border-t border-slate-800">
        © 2026 AI Fashion Studio. Powered by Fashn.ai Virtual Try-On API.
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
